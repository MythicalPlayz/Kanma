import express from "express";
import Cinema from "../models/Cinema.js";
const router = express.Router();

// GET /api/cinemas - Returns a list of all cinemas
router.get('/', async (req, res) => {
    try {
        const cinemas = await Cinema.find();
        res.json(cinemas);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;