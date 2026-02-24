const express = require('express');
const leaveController = require('../controllers/leaveController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Employee routes
router.post('/request', authMiddleware, leaveController.requestLeave);
router.get('/my-leaves', authMiddleware, leaveController.getMyLeaves);
router.delete('/cancel/:leaveId', authMiddleware, leaveController.cancelLeave);

// Admin routes
router.get('/all', authMiddleware, adminMiddleware, leaveController.getAllLeaves);
router.put('/approve/:leaveId', authMiddleware, adminMiddleware, leaveController.approveLeave);
router.put('/reject/:leaveId', authMiddleware, adminMiddleware, leaveController.rejectLeave);

module.exports = router;
