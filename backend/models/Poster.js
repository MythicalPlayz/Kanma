import mongoose from "mongoose";

const posterSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => crypto.randomUUID(),
        lowercase: true,
        trim: true
    },
    posterImage: {
        type: String,
        default: "https://placehold.co/1280x720?text=Poster+PlaceHolder",
        trim: true,
        required: true,
    },
    posterAlt: {
        type: String,
        trim: true,
        default: "Poster Placeholder",
        required: false,
        maxlength: 100,
    },
    redirectURL: {
        type: String,
        trim: true,
        default: "/",
        required: true,
    }
}, { timestamps: true });

const Poster = mongoose.model("Poster", posterSchema);
export default Poster;