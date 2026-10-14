import mongoose from 'mongoose';

const screenTypeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: "std",
        maxLength: 5
    },
    nameEN: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    nameAR: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    }
}, { timestamps: true });

const ScreenType = mongoose.model('ScreenType', screenTypeSchema);

export default ScreenType;