const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingType: {
    type: String,
    enum: ['designated', 'floater'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  bookedBefore3PM: {
    type: Boolean,
    default: true
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancelledReason: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for unique bookings per employee per date
bookingSchema.index({ employee: 1, bookingDate: 1 });
bookingSchema.index({ seat: 1, bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
