import mongoose from "mongoose";
import crypto from "crypto";

const screenSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomBytes(12).toString("hex"),
        required: true
    },
    code: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true
    },
    cinemaId: {
        type: String,
        required: true,
        trim: true,
        ref: "Cinema",
    },
    screenType: {
        type: String,
        required: true,
        trim: true
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
    seatLayout: [{
        _id: false,
        row: {
            type: [Number],
            required: true,
        },
        seatType: {
            type: String,
            required: true,
            ref: "SeatType"
        }
    }]
}, {timestamps: true,toJSON: {virtuals: true},toObject: {virtuals: true}});

screenSchema.virtual('cinema', {
    ref: 'Cinema',
    localField: 'cinemaId',
    foreignField: 'id',       
    justOne: true
});

screenSchema.pre(/^find/, function () {
    this.populate('cinema');
});

const Screen = mongoose.model("Screen", screenSchema);

export default Screen;