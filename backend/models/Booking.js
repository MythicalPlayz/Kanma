import mongoose from 'mongoose';
import crypto from 'crypto';
import SeatShowTime from './SeatShowTime.js';

const alphaNumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateCode(length = 10) {
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, alphaNumeric.length);
        code += alphaNumeric[randomIndex];
    }
    return code;
}

const bookingSchema = new mongoose.Schema({
    showtimeId: {
        type: String,
        required: true,
        trim: true,
        ref: "Showtime"
    },
    userId: {
        type: String,
        required: true,
        trim: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'expired'],
        default: 'pending',
        required: true
    },
    seats: {
        type: [{
            _id: false,
            seatCode: {
                type: String,
                required: true,
                trim: true
            },
            seatType: {
                type: String,
                required: true,
                trim: true,
                ref: "SeatType"
            }
        }],
        required: true,
        ref: "SeatShowTime"
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    code: {
        type: String,
        required: true,
        unique: true,
        maxLength: 10,
        default: () => generateCode(10)
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;