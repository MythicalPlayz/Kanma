import mongoose from "mongoose";

const seatTypeSchema = new mongoose.Schema({
    code: {
        type: String,
        trim: true,
        required: true,
        unique: true,
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
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
}, { timestamps: true });

const SeatType = mongoose.model("SeatType",seatTypeSchema);

export default SeatType;