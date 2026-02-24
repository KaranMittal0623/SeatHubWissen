const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const { isDesignatedDay, canBookFloaterSeat } = require('../utils/batchUtils');
const { isHolidayOrWeekend, getDateAtMidnight } = require('../utils/dateUtils');

// Get available seats for a date
exports.getAvailableSeats = async (req, res, next) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const bookingDate = new Date(date);
    
    // Check if holiday or weekend
    const isHoliday = await isHolidayOrWeekend(bookingDate);
    if (isHoliday) {
      return res.status(400).json({ message: 'Cannot book on holidays or weekends' });
    }

    // Get all seats
    const allSeats = await Seat.find({ isActive: true });

    // Get booked seats for the date
    const bookedSeats = await Booking.find({
      bookingDate: {
        $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(bookingDate).setHours(23, 59, 59, 999))
      },
      status: 'active'
    }).select('seat');

    const bookedSeatIds = bookedSeats.map(b => b.seat.toString());

    // Filter available seats
    const availableSeats = allSeats.filter(seat => 
      !bookedSeatIds.includes(seat._id.toString())
    );

    res.json({
      date,
      totalSeats: allSeats.length,
      availableSeats: availableSeats.length,
      seats: availableSeats
    });
  } catch (error) {
    next(error);
  }
};

// Book a seat
exports.bookSeat = async (req, res, next) => {
  try {
    const { seatId, bookingDate } = req.body;
    const employeeId = req.user.userId;

    if (!seatId || !bookingDate) {
      return res.status(400).json({ message: 'Seat and date are required' });
    }

    const dateToBook = new Date(bookingDate);
    dateToBook.setHours(0, 0, 0, 0);

    // Check if holiday or weekend
    const isHoliday = await isHolidayOrWeekend(dateToBook);
    if (isHoliday) {
      return res.status(400).json({ message: 'Cannot book on holidays or weekends' });
    }

    // Get employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Get seat details
    const seat = await Seat.findById(seatId);
    if (!seat || !seat.isActive) {
      return res.status(404).json({ message: 'Seat not found or inactive' });
    }

    // Check if already booked
    const existingBooking = await Booking.findOne({
      employee: employeeId,
      bookingDate: {
        $gte: new Date(dateToBook),
        $lt: new Date(dateToBook.getTime() + 24 * 60 * 60 * 1000)
      },
      status: 'active'
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Only one booking per day allowed' });
    }

    // Check if is designated day for employee
    const isDesignated = isDesignatedDay(dateToBook, employee.batch);
    let bookingType = 'designated';

    if (!isDesignated && !seat.isFloater) {
      return res.status(400).json({ 
        message: 'Can only book floater seats on non-designated days' 
      });
    }

    if (!isDesignated && seat.isFloater) {
      // Check if can book floater seat (one day before after 3 PM)
      if (!canBookFloaterSeat(dateToBook)) {
        return res.status(400).json({ 
          message: 'Floater seats can only be booked one day before after 3 PM' 
        });
      }
      bookingType = 'floater';
    }

    // Check if on leave
    const leaveRecord = await Leave.findOne({
      employee: employeeId,
      status: 'approved',
      startDate: { $lte: dateToBook },
      endDate: { $gte: dateToBook }
    });

    if (leaveRecord) {
      return res.status(400).json({ message: 'Cannot book while on leave' });
    }

    // Check if seat is available
    const seatBooking = await Booking.findOne({
      seat: seatId,
      bookingDate: {
        $gte: new Date(dateToBook),
        $lt: new Date(dateToBook.getTime() + 24 * 60 * 60 * 1000)
      },
      status: 'active'
    });

    if (seatBooking) {
      return res.status(400).json({ message: 'Seat already booked for this date' });
    }

    // Create booking
    const booking = new Booking({
      employee: employeeId,
      seat: seatId,
      bookingDate: dateToBook,
      bookingType
    });

    await booking.save();

    // Populate and return
    await booking.populate('employee', 'name employeeId batch');
    await booking.populate('seat', 'seatNumber floor zone');

    res.status(201).json({
      message: 'Seat booked successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Get my bookings
exports.getMyBookings = async (req, res, next) => {
  try {
    const employeeId = req.user.userId;
    const { startDate, endDate, status = 'active' } = req.query;

    let query = { employee: employeeId };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) query.bookingDate.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.bookingDate.$lte = end;
      }
    }

    const bookings = await Booking.find(query)
      .populate('seat', 'seatNumber floor zone isFloater')
      .sort({ bookingDate: -1 });

    res.json({ 
      total: bookings.length,
      bookings 
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const employeeId = req.user.userId;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.employee.toString() !== employeeId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Can only cancel active bookings' });
    }

    // Check if already past the date
    const bookingDate = new Date(booking.bookingDate);
    if (bookingDate < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledReason = reason || 'Employee cancelled';

    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};
