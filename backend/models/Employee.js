const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  batch: {
    type: Number,
    enum: [1, 2, null],
    default: null,
    required: function() {
      return this.role === 'employee';
    }
  },
  department: {
    type: String,
    default: 'General'
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalDaysOffice: {
    type: Number,
    default: 0
  },
  currentMonthDays: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
employeeSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
