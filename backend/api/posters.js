import express from "express";
import Poster from "../models/Poster.js";
const router = express.Router();

// GET /api/posters - Returns all posters
router.get('/', async (req, res) => {
    try {
        const posters = await Poster.find().sort({ createdAt: -1 });
        res.json(posters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;