import express from "express";

const router = express.Router();
const OTPNeeded = true; // Simulate whether OTP is needed or not

import crypto from 'crypto';

let paymentSessions = []; // Store payment sessions in memory for simplicity
/*
  {
    payCode: "123456",
    ammount: 100,
    accountId: "user123",
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes from now
    serverKey: "serverKey" // This is the key that the server will use to encrypt the payCode before sending it back to the client
    postServerURL: "https://example.com/payment" // This is the URL that the client will use to post the payCode to the server for payment
  }

*/

let keypair = null;

// generate a public and private key pair using RSA algorithm
function generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'jwk'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'jwk'
        }
    });
    console.log('Generated public key:', publicKey);
    console.log('Generated private key:', privateKey);
    keypair = { publicKey, privateKey };
}

const luhnCheck = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}

const encryptData = (data) => {

    // updated to use Hybird System

    const jsonData = JSON.stringify(data);

    // gen , aes key and iv
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // encrypt the data using aes
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    let encryptedData = cipher.update(jsonData, 'utf8', 'base64');
    encryptedData += cipher.final('base64');
    const authTag = cipher.getAuthTag().toString('base64');

    // encrypt the aes key using rsa
    const encryptedAesKey = crypto.publicEncrypt(
        {
            key: publicKeyObject,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        aesKey
    ).toString('base64');

    // return the encrypted data, aes key and iv
    return {
        encryptedData,
        key: encryptedAesKey,
        iv: iv.toString('base64'),
        authTag
    };


    // const buffer = Buffer.from(JSON.stringify(data), 'utf8');
    // const encryptedData = crypto.publicEncrypt(
    //     {
    //         key: publicKeyObject,
    //         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //         oaepHash: 'sha256'
    //     },
    //     buffer
    // );
    // return encryptedData.toString('base64');
}

const decryptData = (encryptedData, isJson = true) => {

    try {

        // 1. Decrypt the AES key using RSA private key
        const buffer = Buffer.from(encryptedData.key, 'base64');
        const aesKey = crypto.privateDecrypt(
            {
                key: privateKeyObject,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            buffer
        );

        // 2. Initialize the AES-256-GCM decipher
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm', 
            aesKey, 
            Buffer.from(encryptedData.iv, 'base64')
        );

        // 3. SET THE AUTH TAG FIRST (Must happen before update/final)
        const authTag = Buffer.from(encryptedData.authTag, 'base64');
        decipher.setAuthTag(authTag);

        // 4. Decrypt the payload data (done cleanly in one pass)
        let decryptedJson = decipher.update(encryptedData.encryptedData, 'base64', 'utf8');
        decryptedJson += decipher.final('utf8'); // This verifies the auth tag automatically

        // 5. Return as JSON or raw string
        if (isJson) {
            return JSON.parse(decryptedJson);
        }
        return decryptedJson;

    } catch (error) {
        console.error('Error decrypting data:', error);
        throw new Error('Decryption failed');
    }

    // const buffer = Buffer.from(encryptedData, 'base64');
    // const decryptedData = crypto.privateDecrypt(
    //     {
    //         key: privateKeyObject,
    //         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //         oaepHash: 'sha256'
    //     },
    //     buffer
    // );
    // if (isJson) {
    //     return JSON.parse(decryptedData.toString());
    // }
    // return decryptedData.toString();
}

const paymentSessionsCleanup = () => {
    const now = Date.now();
    paymentSessions = paymentSessions.filter(session => session.expiresAt > now);
}

setInterval(paymentSessionsCleanup, 60 * 1000);

generateKeyPair();

const privateKeyObject = crypto.createPrivateKey({
    key: keypair.privateKey,
    format: 'jwk'
});

const publicKeyObject = crypto.createPublicKey({
    key: keypair.publicKey,
    format: 'jwk'
});


// GET /bank/public-key -- Returns the public key for encryption
router.get("/public-key", (req, res) => {
    if (!keypair) {
        generateKeyPair();
    }
    res.json({ publicKey: keypair.publicKey });
});

// POST /bank/generate-paycode -- Generates a payCode for a given accountId and amount, returns the payCode
router.post("/generate-paycode", (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData);
    if (!decryptedData) {
        return res.status(400).json({ error: 'Invalid encrypted data' });
    }
    const { accountId, amount, key, postServerURL } = decryptedData;
    if (!accountId || !amount || !key) {
        return res.status(400).json({ error: 'Missing accountId or amount in decrypted data' });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Generate a unique payCode
    const payCode = crypto.randomBytes(6).toString('hex');

    // Create a new payment session
    const paymentSession = {
        payCode,
        amount,
        accountId,
        serverKey: key,
        postServerURL,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes from now
    };

    // Add the payment session to the array
    paymentSessions.push(paymentSession);

    // encrypt the payCode before sending it back to the client using the key provided in the request
    const buffer = Buffer.from(JSON.stringify({ payCode }), 'utf8');
    const encryptedPayCode = crypto.publicEncrypt(
        {
            key: crypto.createPublicKey({
                key: key,
                format: 'jwk',
                type: 'pkcs1'
            }),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        buffer
    );

    const bankEncryptedPayCode = crypto.publicEncrypt(
        {
            key: publicKeyObject,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        buffer
    );
    res.json({ payCode: encryptedPayCode.toString('base64'), userPayCode: bankEncryptedPayCode.toString('base64') });
});

// POST /bank/payment -- Accepts encrypted payment data, decrypts it, checks the payment, return 200 if valid, 201 if otp is needed
router.post("/payment", (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData);
    if (!decryptedData) {
        return res.status(400).json({ error: 'Invalid encrypted data' });
    }

    const { card, payCode } = decryptedData;
    if (!card || !payCode) {
        return res.status(400).json({ error: 'Missing card or payCode in decrypted data' });
    }

    // Perform payment validation logic here
    // 1st check (card number is 16 digits and valid Luhn algorithm)
    if (card.digits.length !== 16 || !luhnCheck(card.digits)) {
        return res.status(400).json({ error: 'Invalid card number' });
    }

    // 2nd check (expirtation date is valid and not expired)
    const currentDate = new Date();
    const expDate = new Date(2000 + parseInt(card.expirationYear), card.expirationMonth - 1);
    if (expDate < currentDate) {
        return res.status(400).json({ error: 'Card has expired' });
    }

    // 3rd check (cvv is 3 digits)
    if (card.cvv.length !== 3 || !/^\d{3}$/.test(card.cvv)) {
        return res.status(400).json({ error: 'Invalid CVV' });
    }

    // 4th check paycode is encrypted with the bank key thus it needs to be decrypted
    // it is decrypted using ae
    const decryptedPayCodeString = crypto.privateDecrypt(
        {
            key: privateKeyObject,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        Buffer.from(payCode, 'base64')
    ).toString('utf8');
    const decryptedPayCode = JSON.parse(decryptedPayCodeString).payCode;

    // 5rd check (payCode is valid)
    const paymentSession = paymentSessions.find((session) => session.payCode === decryptedPayCode);
    if (!paymentSession) {
        return res.status(400).json({ error: 'Invalid payCode' });
    }
    if (paymentSession.expiresAt < Date.now()) {
        return res.status(400).json({ error: 'PayCode has expired' });
    }

    // If all checks pass, return 200 OK (for now we will add a var to simulate if otp is needed or not)
    if (OTPNeeded) {
        return res.status(201).json({ message: 'OTP is required for this transaction' });
    }
    return res.status(200).json({ message: 'Payment successful' });
});

// POST /bank/otp -- Accepts encrypted otp data, decrypts it, checks the otp, return 200 if valid
router.post("/otp", (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData);
    if (!decryptedData) {
        return res.status(400).json({ error: 'Invalid encrypted data' });
    }
    const { otp, payCode } = decryptedData;
    if (!otp || !payCode) {
        return res.status(400).json({ error: 'Missing otp or payCode in decrypted data' });
    }
    if (otp !== "123456") { // Simulate OTP check
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    // If OTP is valid, return 200 OK
    return res.status(200).json({ message: 'OTP verified successfully' });
});

// TEST ENCRYPTION ENDPOINTS
router.post("/test-encrypt", (req, res) => {
    const { data } = req.body;
    const encryptedData = encryptData(data);
    res.json({ encryptedData });
});

router.post("/test-decrypt", (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = decryptData(encryptedData);
    res.json({ decryptedData });
});

export default router;