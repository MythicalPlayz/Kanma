import mongoose from "mongoose";
import crypto from "crypto";

const snackSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => crypto.randomUUID(),
            lowercase: true,
            trim: true
        },
        nameEN: {
            type: String,
            trim: true,
            required: true,
            maxlength: 50
        },
        nameAR: {
            type: String,
            trim: true,
            required: true,
            maxlength: 50
        },
        category: {
            type: String,
            ref: "SnackCategory",
            required: true
        },
        price: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        image: {
            type: String,
            default: "https://placehold.co/256x256?text=Snack+PlaceHolder",
            trim: true
        }
    },
    { timestamps: true }
);

const Snack = mongoose.model("Snack", snackSchema);
export default Snack;