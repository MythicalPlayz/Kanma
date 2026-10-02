import express from 'express';
import crypto from 'crypto';
import Account from '../models/Account.js';
import Session from '../models/Session.js';

const router = express.Router();

// Helper: Extract Bearer token from headers
const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

// -------------------------------------------------------------
// POST /api/account/register
// Registers user & creates an initial 1-hour session
// -------------------------------------------------------------
router.post('/register', async (req, res) => {
    const { FName, LName, email, password, telephone } = req.body;

    try {
        const newAccount = new Account({
            FName,
            LName,
            email,
            password,
            telephone,
            status: 'unverified'
        });

        await newAccount.save();

        // Create a 1 hour session token immediately upon registration
        const session = await Session.create({
            accountId: newAccount._id,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 60 * 60
        });

        res.status(201).json({
            message: 'Account registered successfully',
            token: session.token,
            user: {
                id: newAccount._id,
                FName: newAccount.FName,
                LName: newAccount.LName,
                email: newAccount.email,
                status: newAccount.status,
                type: newAccount.type
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                message: `An account with this ${duplicateField} already exists.`
            });
        }
        res.status(400).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// POST /api/account/login
// Authenticates credentials & issues a new 3-day session token
// -------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const account = await Account.findOne({ email: email.toLowerCase().trim() });
        if (!account) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (account.status === 'unverified') {
            const existingSession = await Session.findOne({ accountId: account._id });
            return res.status(403).json({ message: 'Account is unverified. Please verify your account first.', expiresAt: account.unverifiedExpiresAt, token: existingSession?.token || null });
        }

        const isMatch = await account.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // check if there is already an active session for this account
        const existingSession = await Session.findOne({
            accountId: account._id,
            expiresAt: { $gt: new Date() }
        });
        if (existingSession) {
            // delete the existing session to prevent multiple active sessions
            await Session.deleteOne({ _id: existingSession._id });
        }

        // Generate fresh session valid for 3 days
        const session = await Session.create({
            accountId: account._id,
            expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        });

        res.status(200).json({
            message: 'Login successful',
            token: session.token,
            user: {
                id: account._id,
                FName: account.FName,
                LName: account.LName,
                email: account.email,
                status: account.status,
                type: account.type
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// POST /api/account/verify
// Checks 6-digit code ('030105') & transitions account to 'verified'
// -------------------------------------------------------------
router.post('/verify', async (req, res) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const { code } = req.body;
    if (!code) {
        return res.status(400).json({ message: 'Verification code is required' });
    }

    // Strip whitespace so both "03 01 05" and "030105" work
    const cleanCode = String(code).replace(/\s+/g, '');
    const HARDCODED_CODE = '030105';

    if (cleanCode !== HARDCODED_CODE) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if the account is already verified
    if (Account.findById({ _id: req.body.accountId, status: 'verified' })) {
        // return res.status(400).json({ message: 'Account is already verified' });
    }

    try {
        const session = await Session.findOne({
            token,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return res.status(401).json({ message: 'Session invalid or expired' });
        }

        // Update status and unset unverifiedExpiresAt to stop the 1-hour TTL deletion
        const account = await Account.findByIdAndUpdate(
            session.accountId,
            {
                status: 'verified',
                $unset: { unverifiedExpiresAt: 1 }
            },
            { new: true }
        ).select('-password');

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // update the session to extend its expiration to 3 days from now
        session.expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        await session.save();

        res.status(200).json({
            message: 'Account successfully verified',
            user: account
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// POST /api/account/refresh
// Extends an active session expiration to now + 3 days
// -------------------------------------------------------------
router.post('/refresh', async (req, res) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const newExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

        const session = await Session.findOneAndUpdate(
            {
                token,
                expiresAt: { $gt: new Date() } // Can only refresh active, unexpired sessions
            },
            { expiresAt: newExpiresAt },
            { new: true }
        );

        if (!session) {
            return res.status(401).json({ message: 'Session expired or not found. Please log in again.' });
        }

        res.status(200).json({
            message: 'Session refreshed successfully',
            expiresAt: session.expiresAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// GET /api/account/me
// Returns current authenticated user details from bearer token
// -------------------------------------------------------------
router.get('/me', async (req, res) => {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const session = await Session.findOne({
            token,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return res.status(401).json({ message: 'Session invalid or expired' });
        }

        const account = await Account.findById(session.accountId).select('-password');
        if (!account) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user: account });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// POST /api/account/logout
// Drops the active session token from the DB
// -------------------------------------------------------------
router.post('/logout', async (req, res) => {
    const token = extractToken(req);
    if (token) {
        await Session.deleteOne({ token });
    }
    res.status(200).json({ message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// POST /api/account/forgot-password
// -------------------------------------------------------------
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const account = await Account.findOne({ email: email?.toLowerCase().trim() });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        account.resetPasswordToken = resetToken;
        account.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await account.save();

        res.status(200).json({
            message: 'Password reset token generated',
            resetToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// -------------------------------------------------------------
// POST /api/account/reset-password
// -------------------------------------------------------------
router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
        const account = await Account.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!account) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        account.password = newPassword; // Handled by pre-save hook for validation & hashing
        account.resetPasswordToken = undefined;
        account.resetPasswordExpires = undefined;
        await account.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;