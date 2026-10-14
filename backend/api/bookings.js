import express from "express";
import Showtime from "../models/Showtime.js";
import Session from "../models/Session.js";
import Booking from "../models/Booking.js";
import SeatShowTime from "../models/SeatShowTime.js";
import SeatType from "../models/SeatType.js";
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

// GET /api/bookings -- Gets all bookings for the authenticated user
router.get('/', async (req, res) => {
    try {
        const isValid = await validateAccount(req);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = extractToken(req);
        const session = await Session.findOne({ token });
        const userId = session.accountId;

        const bookings = await Booking.find({ userId })
            .populate({
                path: 'showtimeId',
                model: 'Showtime',
                select: 'cinemaId movieId screenId startTime',
                populate: [
                    { path: 'screen', select: 'nameEN nameAR screenType code' },
                    { path: 'movie', select: 'titleEN titleAR posterURL id' }
                ]
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/bookings/book -- Creates a new booking for the authenticated user
router.post("/book/", async (req, res) => {
    try {
        const isValid = await validateAccount(req);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = extractToken(req);
        const session = await Session.findOne({ token });
        const userId = session.accountId;

        const { showtimeId, seats } = req.body;

        // seats would be an array containing each two values: seatCode and seatType, e.g. [{seatCode: "A1", seatType: "VIP"}, {seatCode: "A2", seatType: "VIP"}]

        if (!showtimeId || !seats || seats.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const showtime = await Showtime.findById(showtimeId);
        if (!showtime) {
            return res.status(404).json({ error: 'Showtime not found' });
        }

        // check if showtime has already started
        const currentTime = new Date();
        if (currentTime >= showtime.startTime) {
            return res.status(400).json({ error: 'Showtime has already started' });
        }

        const seatCodes = seats.map(seat => seat.seatCode);
        if (!seatCodes || seatCodes.length === 0) {
            return res.status(400).json({ error: 'No seats provided' });
        }

        const seatShowTimes = await SeatShowTime.find({ showtimeId, seatCode: { $in: seatCodes } });
        if (seatShowTimes.length > 0) {
            return res.status(400).json({ error: 'One or more seats are already booked' });
        }

        let totalPrice = 0;
        for (const seat of seats) {
            const seatTypeText = seat.seatType.toUpperCase();
            const seatType = await SeatType.findOne({ code: seatTypeText });
            if (!seatType) {
                return res.status(400).json({ error: `Seat type ${seat.seatType} not found` });
            }
            totalPrice += seatType.price;
        }

        const newBooking = new Booking({
            showtimeId,
            userId,
            seats,
            price: totalPrice
        });

        const savedBooking = await newBooking.save();

        SeatShowTime.insertMany(seats.map(seat => ({
            bookingId: newBooking._id,
            seatCode: seat.seatCode,
            seatType: seat.seatType,
            accountId: userId
        })));

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/bookings/confirm -- Confirms a booking for the authenticated user
router.post("/confirm/", async (req, res) => {
    try {
        const isValid = await validateAccount(req);
        if (!isValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = extractToken(req);
        const session = await Session.findOne({ token });
        const userId = session.accountId;

        const { bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        booking.status = 'confirmed';
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;