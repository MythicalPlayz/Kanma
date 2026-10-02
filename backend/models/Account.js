import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(01|\+201)[0125][0-9]{8}/;
const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

const accountSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomBytes(32).toString('hex'),
        trim: true,
    },
    FName: { type: String, required: true, trim: true },
    LName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: emailRegex },
    password: { type: String, required: true, match: passwordRegex },
    telephone: { type: String, required: true, unique: true, trim: true, match: phoneRegex },
    type: {
        type: String,
        enum: ['guest', 'Staff', 'Admin'],
        default: 'guest',
    },
    status: {
        type: String,
        enum: ['unverified', 'verified', 'banned'],
        default: 'unverified',
    },
    // Automatically populated on creation; cleared once verified
    unverifiedExpiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now (60 * 60 * 1000 ms)
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
}, {
    timestamps: true,
});

// MongoDB TTL index: drops the doc after 1 hour ONLY IF status is 'unverified'
accountSchema.index(
    { unverifiedExpiresAt: 1 },
    {
        expireAfterSeconds: 0,
        partialFilterExpression: { status: 'unverified' }
    }
);

// Pre-save hook for password hashing (same as before)
accountSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

accountSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Account = mongoose.model('Account', accountSchema);
export default Account;