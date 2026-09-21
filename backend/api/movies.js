import express from "express";
import Movie from "../models/Movie.js";
const router = express.Router();


// GET /api/movies/home - Returns 4 released and 4 coming soon movies
router.get('/home', async (req, res) => {
    try {
        const [released, comingSoon] = await Promise.all([
            Movie.find({ status: 'Released' })
                .sort({ releaseDate: -1 })
                .limit(4),

            Movie.find({ status: 'Coming Soon' })
                .sort({ releaseDate: 1 })
                .limit(4)
        ]);
        res.json({
            released,
            comingSoon
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/movies/movie/:id - Returns a specific movie by ID
router.get('/movie/:id', async (req, res) => {
    try {
        const movie = await Movie.findOne({ id: req.params.id });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/movies/nowshowing - Returns a list of movies that are currently released
router.get('/nowshowing', async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'Released' })
            .sort({ releaseDate: -1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/movies/comingsoon - Returns a list of movies that are coming soon
router.get('/comingsoon', async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'Coming Soon' })
            .sort({ releaseDate: 1 });
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;