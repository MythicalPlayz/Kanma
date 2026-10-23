import express from 'express';
import { getPublicKey } from '../auth/auth.js';

const router = express.Router();

// GET /api/auth/key - Gets the public key
router.get('/key', (req, res) => {
    try {
        const publicKey = getPublicKey();
        res.status(200).json({ publicKey });
    } catch (error) {
        console.error('Error retrieving public key:', error);
        res.status(500).json({ error: 'Failed to retrieve public key' });
    }
});

export default router;

