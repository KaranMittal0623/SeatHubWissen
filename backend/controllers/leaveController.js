const Leave = require('../models/Leave');
const Booking = require('../models/Booking');

// Request leave
exports.requestLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user.userId;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Leave type, start date, and end date are required' 
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Create leave request
    const leave = new Leave({
      employee: employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'pending'
    });

    await leave.save();

    res.status(201).json({
      message: 'Leave request submitted',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// Get my leaves
exports.getMyLeaves = async (req, res, next) => {
  try {
    const employeeId = req.user.userId;
    const { status } = req.query;

    let query = { employee: employeeId };

    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query).sort({ startDate: -1 });

    res.json({
      total: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// Cancel leave request
exports.cancelLeave = async (req, res, next) => {
  try {
    const { leaveId } = req.params;
    const employeeId = req.user.userId;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.employee.toString() !== employeeId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending leave' });
    }

    await Leave.findByIdAndDelete(leaveId);

    res.json({ message: 'Leave request cancelled' });
  } catch (error) {
    next(error);
  }
};

// Get all leaves (Admin)
exports.getAllLeaves = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .populate('employee', 'name email employeeId batch')
      .populate('approvedBy', 'name')
      .sort({ startDate: -1 });

    res.json({
      total: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// Approve leave (Admin)
exports.approveLeave = async (req, res, next) => {
  try {
    const { leaveId } = req.params;
    const adminId = req.user.userId;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    // Mark all bookings as cancelled for the leave period
    await Booking.updateMany(
      {
        employee: leave.employee,
        bookingDate: {
          $gte: leave.startDate,
          $lte: leave.endDate
        },
        status: 'active'
      },
      {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledReason: 'Employee on approved leave'
      }
    );

    leave.status = 'approved';
    leave.approvedBy = adminId;
    leave.approvedAt = new Date();

    await leave.save();

    res.json({
      message: 'Leave approved',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// Reject leave (Admin)
exports.rejectLeave = async (req, res, next) => {
  try {
    const { leaveId } = req.params;

    const leave = await Leave.findById(leaveId);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.status = 'rejected';

    await leave.save();

    res.json({
      message: 'Leave rejected',
      leave
    });
  } catch (error) {
    next(error);
  }
};
