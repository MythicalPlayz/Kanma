import mongoose from "mongoose";
import crypto from "crypto";

export const snackCategorySchema = new mongoose.Schema(
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
        faIcon: {
            type: String,
            enum: [
                "faBowlFood",
                "faPlay",
                "faHotdog",
                "faBlender",
                "faCandyCane",
                "faMugHot",
                "faSnowflake"
            ],
            default: "faBowlFood",
            required: true
        }
    },
    { timestamps: true }
);

const SnackCategory = mongoose.model("SnackCategory", snackCategorySchema);
export default SnackCategory;