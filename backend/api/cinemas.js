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

// GET /api/cinemas/:id - Returns a specific cinema by ID
router.get('/:id', async (req, res) => {
    try {
        const cinema = await Cinema.find({ id: req.params.id });
        if (!cinema) {
            return res.status(404).json({ error: 'Cinema not found' });
        }
        res.json(cinema);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;