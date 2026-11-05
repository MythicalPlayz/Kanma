import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    cinemaId: {
        type: String,
        required: true,
        trim: true,
        ref: "Cinema"
    },
    movieId: {
        type: String,
        required: true,
        trim: true,
        ref: "Movie"
    },
    screenId: {
        type: String,
        required: true,
        trim: true,
        ref: "Screen"
    },
    startTime: {
        type: Date,
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

showtimeSchema.virtual('screen', {
    ref: 'Screen',
    localField: 'screenId',
    foreignField: 'code',
    justOne: true
});

showtimeSchema.virtual('movie', {
    ref: 'Movie',
    localField: 'movieId',
    foreignField: 'id',
    justOne: true
});

showtimeSchema.virtual('cinema', {
    ref: 'Cinema',
    localField: 'cinemaId',
    foreignField: 'id',
    justOne: true
});

showtimeSchema.pre(/^find/, function () {
    this.populate('screen');
    this.populate('movie');
    this.populate('cinema');
});

const Showtime = mongoose.model('Showtime', showtimeSchema);
export default Showtime;