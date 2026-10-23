import crypto from 'crypto';

let keypair = null;

// generate a public and private key pair using RSA algorithm
export function generateKeyPair() {
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

export function getPublicKey() {
    if (!keypair) {
        generateKeyPair();
    }
    return keypair.publicKey;
}

export function getPrivateKey() {
    if (!keypair) {
        generateKeyPair();
    }
    return keypair.privateKey;
}

export function encryptData(data) {
    const buffer = Buffer.from(JSON.stringify(data), 'utf8');
    const encryptedData = crypto.publicEncrypt(
        {
            key: getPublicKey(),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        buffer
    );
    return encryptedData.toString('base64');
}

export function decryptData(encryptedData, isJson = true) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decryptedData = crypto.privateDecrypt(
        {
            key: getPrivateKey(),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        },
        buffer
    );
    if (isJson) {
        return JSON.parse(decryptedData.toString('utf8'));
    }
    return decryptedData.toString('utf8');
}