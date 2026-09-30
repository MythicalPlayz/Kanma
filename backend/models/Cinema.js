import mongoose from 'mongoose';

const cinemaSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        primaryKey: true,
        trim: true,
    },
    nameEN: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    nameAR: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    addressEN: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    addressAR: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    googleMapsLink: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true,
        default: 'https://res.cloudinary.com/dxjv6gq3f/image/upload/v1697040910/cinema-placeholder.png'
    },
}, { timestamps: true });

const Cinema = mongoose.model('Cinema', cinemaSchema);

export default Cinema;