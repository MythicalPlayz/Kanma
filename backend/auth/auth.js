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

export function getPublicKeyObject() {
    const publicKey = getPublicKey();
    return crypto.createPublicKey({
        key: publicKey,
        format: 'jwk',
        type: 'pkcs1'
    });
}

export function getPrivateKeyObject() {
    const privateKey = getPrivateKey();
    return crypto.createPrivateKey({
        key: privateKey,
        format: 'jwk',
        type: 'pkcs1'
    });
}

export function encryptData(data) {

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
            key: getPublicKeyObject(),
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
    //         key: getPublicKeyObject(),
    //         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //         oaepHash: 'sha256'
    //     },
    //     buffer
    // );
    // return encryptedData.toString('base64');
}

export function encryptDataWithKey(data, publicKey) {
   
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
            key: crypto.createPublicKey({
                key: publicKey,
                format: 'jwk',
                type: 'pkcs1'
            }),
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
}
export function decryptData(encryptedData, isJson = true) {

    try {

        // 1. Decrypt the AES key using RSA private key
        const buffer = Buffer.from(encryptedData.key, 'base64');
        const aesKey = crypto.privateDecrypt(
            {
                key: getPrivateKeyObject(),
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
    //         key: getPrivateKeyObject(),
    //         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //         oaepHash: 'sha256'
    //     },
    //     buffer
    // );
    // if (isJson) {
    //     return JSON.parse(decryptedData.toString('utf8'));
    // }
    // return decryptedData.toString('utf8');
}