import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^[a-z0-9-]+$/ // Only allow lowercase alphanumeric characters
    },
    titleEN: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    titleAR: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    descriptionEN: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    descriptionAR: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    director: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    cast: {
        type: [{ type: String, trim: true, maxlength: 100 }],
        validate: [arr => arr.length > 0, 'Cast must have at least one member']
    },
    releaseDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    canBook: {
        type: Boolean,
        default: false
    },
    rating: {
        type: String,
        enum: ['G', 'PG', '12+', '15+', '17+', '18+', 'NR'],
        default: 'NR'
    },
    status: {
        type: String,
        enum: ['Coming Soon', 'Released', 'Completed', 'Cancelled', 'Banned'],
        default: 'Coming Soon'
    },
    genre: {
        type: String,
        required: true,
        enum: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Animation']
    },
    language: {
        type: String,
        enum: ['ar', 'en', 'fr', 'es', 'de', 'cn', 'jp', 'kr'],
        default: 'en'
    },
    posterURL: {
        type: String,
        required: true,
        default: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
    },
    trailerURL: {
        type: String,
        required: true,
        default: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;