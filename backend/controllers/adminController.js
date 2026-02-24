const Seat = require('../models/Seat');
const Employee = require('../models/Employee');
const Booking = require('../models/Booking');
const Leave = require('../models/Leave');
const Holiday = require('../models/Holiday');


exports.createSeat = async (req, res, next) => {
  try {
    const { seatNumber, floor, zone, isFloater, features } = req.body;

    if (!seatNumber || !floor || !zone) {
      return res.status(400).json({ 
        message: 'Seat number, floor, and zone are required' 
      });
    }

    const seat = new Seat({
      seatNumber,
      floor,
      zone,
      isFloater: isFloater || false,
      features: features || []
    });

    await seat.save();

    res.status(201).json({
      message: 'Seat created',
      seat
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllSeats = async (req, res, next) => {
  try {
    const { isFloater } = req.query;

    let query = { isActive: true };
    if (isFloater !== undefined) {
      query.isFloater = isFloater === 'true';
    }

    const seats = await Seat.find(query);

    res.json({
      total: seats.length,
      seats
    });
  } catch (error) {
    next(error);
  }
};


exports.updateSeat = async (req, res, next) => {
  try {
    const { seatId } = req.params;
    const { seatNumber, floor, zone, isFloater, isActive, features } = req.body;

    const seat = await Seat.findByIdAndUpdate(
      seatId,
      { seatNumber, floor, zone, isFloater, isActive, features },
      { new: true }
    );

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    res.json({
      message: 'Seat updated',
      seat
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllEmployees = async (req, res, next) => {
  try {
    const { batch, role } = req.query;

    let query = { isActive: true };
    if (batch) query.batch = parseInt(batch);
    if (role) query.role = role;

    const employees = await Employee.find(query).select('-password');

    res.json({
      total: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
};


exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    
    const todaysBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'active'
    });

    
    const totalEmployees = await Employee.countDocuments({ 
      isActive: true,
      role: 'employee' 
    });

    
    const totalSeats = await Seat.countDocuments({ isActive: true });

    
    const bookedSeatsToday = await Booking.find({
      bookingDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'active'
    }).select('seat');

    const bookedSeatIds = bookedSeatsToday.map(b => b.seat.toString());
    const availableSeats = await Seat.countDocuments({
      isActive: true,
      _id: { $nin: bookedSeatIds }
    });

    
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    
    const batch1Count = await Employee.countDocuments({ batch: 1, isActive: true, role: 'employee' });
    const batch2Count = await Employee.countDocuments({ batch: 2, isActive: true, role: 'employee' });

    res.json({
      stats: {
        totalEmployees,
        totalSeats,
        availableSeatsToday: availableSeats,
        bookedSeatsToday: todaysBookings,
        pendingLeaves,
        occupancyRate: ((todaysBookings / totalSeats) * 100).toFixed(2),
        batchDistribution: {
          batch1: batch1Count,
          batch2: batch2Count
        }
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.getBookingsReport = async (req, res, next) => {
  try {
    const { startDate, endDate, employeeId, batch } = req.query;

    let query = { status: 'active' };

    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.bookingDate.$lte = end;
      }
    }

    if (employeeId) {
      query.employee = employeeId;
    }

    let bookings = await Booking.find(query)
      .populate('employee', 'name employeeId batch email')
      .populate('seat', 'seatNumber floor zone')
      .sort({ bookingDate: -1 });

    if (batch) {
      bookings = bookings.filter(b => b.employee.batch === parseInt(batch));
    }

    res.json({
      total: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};


exports.addHoliday = async (req, res, next) => {
  try {
    const { date, name } = req.body;

    if (!date || !name) {
      return res.status(400).json({ message: 'Date and name are required' });
    }

    const holiday = new Holiday({
      date: new Date(date),
      name,
      type: 'holiday'
    });

    await holiday.save();

    res.status(201).json({
      message: 'Holiday added',
      holiday
    });
  } catch (error) {
    next(error);
  }
};


exports.getHolidays = async (req, res, next) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });

    res.json({
      total: holidays.length,
      holidays
    });
  } catch (error) {
    next(error);
  }
};
