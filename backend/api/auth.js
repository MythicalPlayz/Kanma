import express from 'express';
import { decryptData, encryptData, getPublicKey } from '../auth/auth.js';

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

//POST /api/auth/test-encrypt -- Encrypts data using the public key and returns the encrypted data
router.post('/test-encrypt', (req, res) => {
    const { data } = req.body;
    const encryptedData = encryptData(data);
    res.json({ encryptedData });
});

// POST /api/auth/test-decrypt -- Decrypts data using the private key and returns the decrypted data
router.post('/test-decrypt', (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData);
    res.json({ decryptedData });
});

export default router;

