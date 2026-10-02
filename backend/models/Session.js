import mongoose from 'mongoose';
import crypto from 'crypto';

const sessionSchema = new mongoose.Schema({
    accountId: {
        type: String,
        ref: 'Account',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
        default: () => crypto.randomBytes(32).toString('hex'), // Secure 64-char token
    },
    expiresAt: {
        type: Date,
        required: true,
        // 3 days from creation
        default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }
}, {
    timestamps: true
});

// MongoDB automatically purges documents when current date >= expiresAt
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);

export default Session;