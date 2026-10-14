import mongoose from 'mongoose';


const seatShowTimeSchema = new mongoose.Schema({
    bookingId: {
        type: String,
        trim: true,
        ref: "Booking"
    },
    showtimeId: {
        type: String,
        trim: true,
        ref: "Showtime"
    },
    seatCode: {
        type: String,
        required: true,
        trim: true,
    },
    seatType: {
        type: String,
        required: true,
        trim: true,
        ref: "SeatType"
    },
}, { timestamps: true });

const SeatShowTime = mongoose.model('SeatShowTime', seatShowTimeSchema);

export default SeatShowTime;