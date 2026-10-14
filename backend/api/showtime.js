import express from "express";
import Cinema from "../models/Cinema.js";
import Screen from "../models/Screen.js";
import ScreenType from "../models/ScreenType.js";
import Showtime from "../models/Showtime.js";
import Movies from "../models/Movie.js";
import Session from "../models/Session.js";
const router = express.Router();

const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

const validateAccount = async (req) => {
    // Implement your token validation logic here
    // Return true if valid, false otherwise
    const token = extractToken(req);
    if (!token) {
        return false;
    }
    const session = await Session.findOne({ token });
    return session ? true : false;
}


// GET /api/showtimes -- Gets all upcoming showtimes available for booking (starts >= 30 mins from now)
// Optional: Can filter by cinemaId, movieId, or date using query parameters
router.get('/', async (req, res) => {
    const { cinemaId, movieId, date } = req.query;
    try {
        const isValid = await validateAccount(req);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Must start at least 30 minutes after current moment
        const bookingCutoff = new Date(Date.now() + 30 * 60 * 1000);

        const filter = {};

        if (cinemaId) {
            filter.cinemaId = cinemaId;
        }
        if (movieId) {
            filter.movieId = movieId;
        }

        if (date) {
            // Parse YYYY-MM-DD cleanly without unexpected UTC shifts
            const [year, month, day] = date.split('-').map(Number);
            const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
            const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

            // Ensure start boundary never goes behind the 30-minute cutoff
            const effectiveStart = startOfDay < bookingCutoff ? bookingCutoff : startOfDay;

            filter.startTime = {
                $gte: effectiveStart,
                $lte: endOfDay
            };
        } else {
            // No date specified: show upcoming shows starting from the cutoff onward
            filter.startTime = { $gte: bookingCutoff };
        }

        const availableShowtimes = await Showtime.find(filter)
            .sort({movieId: 1, cinemaId: 1, startTime: 1}) // Closest shows first
            .populate({
                path: 'movieId',
                model: 'Movie',
                localField: 'movieId',
                foreignField: 'id',
                select: 'titleEN titleAR posterURL id'
            })
            .populate({
                path: 'screenId',
                model: 'Screen',
                localField: 'screenId',
                foreignField: 'code',
                select: 'nameEN nameAR screenType code',
                populate: {
                    path: 'screenTypeDetails',
                    select: 'code nameEN nameAR'
                }
            })
            .populate({
                path: 'cinemaId',
                model: 'Cinema',
                localField: 'cinemaId',
                foreignField: 'id',
                select: 'nameEN nameAR address id'
            });

        res.json(availableShowtimes);
    } catch (error) {
        console.error('Error fetching available showtimes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;