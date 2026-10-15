import Booking from "./models/Booking.js";
import SeatShowtime from "./models/SeatShowTime.js";
import { getIO } from "./socket.js";

// 1. Cleans up bookings that stayed 'pending' past the 10-minute timeout
const cleanExpiredBookings = async () => {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const expiredBookings = await Booking.find({
            status: "pending",
            bookingTime: { $lte: tenMinutesAgo },
        }).select("_id");

        if (expiredBookings.length === 0) return;

        const expiredIds = expiredBookings.map((b) => b._id);

        // Cancel expired bookings
        await Booking.updateMany(
            { _id: { $in: expiredIds } },
            { $set: { status: "expired" } }
        );



        // 1. Find all seats linked to the expired bookings before removing them
        const seatsToRelease = await SeatShowtime.find({
            bookingId: { $in: expiredIds },
        }).select("showtimeId seatCode");

        if (seatsToRelease.length > 0) {
            // 2. Group seat codes by showtimeId
            const seatsByShowtime = seatsToRelease.reduce((acc, seat) => {
                const sId = seat.showtimeId.toString();
                if (!acc[sId]) {
                    acc[sId] = [];
                }
                acc[sId].push(seat.seatCode);
                return acc;
            }, {});

            // 3. Emit the released seats to each specific showtime room
            const io = getIO();
            for (const [showtimeId, seatCodes] of Object.entries(seatsByShowtime)) {
                io.to(`showtime_${showtimeId}`).emit("seats_updated", {
                    action: "release",
                    showtimeId,
                    seats: seatCodes,
                });
            }

            // 4. Delete the held seats from the database
            await SeatShowtime.deleteMany({
                bookingId: { $in: expiredIds },
            });
        }

        console.log(`[Clean] Expired ${expiredIds.length} expired booking(s) and released seats.`);
    } catch (error) {
        console.error("[Clean] Error during expired bookings cleanup:", error);
    }
};

// 2. Finds and removes any SeatShowtime records pointing to non-existent bookings
const cleanOrphanSeats = async () => {
    try {
        const orphanSeats = await SeatShowtime.aggregate([
            {
                $lookup: {
                    from: "bookings", // The actual MongoDB collection name for bookings
                    localField: "bookingId",
                    foreignField: "_id",
                    as: "matchedBooking",
                },
            },
            {
                // Keep only entries where the joined array is empty (no booking found)
                $match: {
                    matchedBooking: { $size: 0 },
                },
            }, {
                $project: { _id: 1 },
            },
        ]);

        if (orphanSeats.length === 0) return;

        const orphanIds = orphanSeats.map((seat) => seat._id);

        await SeatShowtime.deleteMany({ _id: { $in: orphanIds } });

        console.log(`[Clean] Removed ${orphanIds.length} orphaned seat reservation(s).`);
    } catch (error) {
        console.error("[Clean] Error during orphan seats cleanup:", error);
    }
};

// Master cleanup runner
export const runCleanupTasks = async () => {
    await cleanExpiredBookings();
    await cleanOrphanSeats();
};

export const startBookingCleanupTask = (intervalMs = 15 * 60 * 1000) => {
    // Run once immediately on boot
    runCleanupTasks();

    // Schedule regular runs
    return setInterval(runCleanupTasks, intervalMs);
};