import express from "express";
import Cinema from "../models/Cinema.js";
import Screen from "../models/Screen.js";
import ScreenType from "../models/ScreenType.js";
const router = express.Router();

// GET /api/screens/:id - Returns a list of all screens in a specific cinema
router.get('/:id', async (req, res) => {
    try {
        const cinema = await Cinema.find({ id: req.params.id });
        if (!cinema) {
            return res.status(404).json({ error: 'Cinema not found' });
        }
        const screens = await Screen.find({ cinemaId: req.params.id }).populate({
            path: 'screenTypeDetails',
            select: 'code nameEN nameAR'
        });
        res.json(screens);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/screens/screen/:id - Returns a specific screen by ID
router.get('/screen/:id', async (req, res) => {
    try {
        const screens = await Screen.find({ code: req.params.id }).populate({
            path: 'screenTypeDetails',
            select: 'code nameEN nameAR'
        });;
        if (!screens) {
            return res.status(404).json({ error: 'Screen not found' });
        }
        res.json(screens);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;