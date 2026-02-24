const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// Seat management
router.post('/seats', adminController.createSeat);
router.get('/seats', adminController.getAllSeats);
router.put('/seats/:seatId', adminController.updateSeat);

// Employee management
router.get('/employees', adminController.getAllEmployees);

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/bookings-report', adminController.getBookingsReport);

// Holiday management
router.post('/holidays', adminController.addHoliday);
router.get('/holidays', adminController.getHolidays);

module.exports = router;
