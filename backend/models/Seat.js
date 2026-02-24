const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: Number,
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  isFloater: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    enum: [1],
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Seat', seatSchema);
