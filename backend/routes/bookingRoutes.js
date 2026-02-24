const express = require('express');
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/available-seats', authMiddleware, bookingController.getAvailableSeats);
router.post('/book-seat', authMiddleware, bookingController.bookSeat);
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.delete('/cancel/:bookingId', authMiddleware, bookingController.cancelBooking);

module.exports = router;
