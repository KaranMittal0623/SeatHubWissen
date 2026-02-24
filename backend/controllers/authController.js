const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

const generateToken = (id, role) => {
  return jwt.sign({ userId: id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Register employee
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, employeeId, batch } = req.body;

    // Validate batch
    if (![1, 2].includes(batch)) {
      return res.status(400).json({ message: 'Batch must be 1 or 2' });
    }

    // Check if employee exists
    const existingEmployee = await Employee.findOne({ 
      $or: [{ email }, { employeeId }] 
    });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    // Create employee
    const employee = new Employee({
      name,
      email,
      password,
      employeeId,
      batch
    });

    await employee.save();

    // Generate token
    const token = generateToken(employee._id, employee.role);

    res.status(201).json({
      message: 'Registration successful',
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        batch: employee.batch,
        role: employee.role
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const employee = await Employee.findOne({ email }).select('+password');

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await employee.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(employee._id, employee.role);

    res.json({
      message: 'Login successful',
      token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        batch: employee.batch,
        role: employee.role
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.getCurrentEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.user.userId);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        batch: employee.batch,
        role: employee.role,
        department: employee.department,
        totalDaysOffice: employee.totalDaysOffice,
        currentMonthDays: employee.currentMonthDays
      }
    });
  } catch (error) {
    next(error);
  }
};


exports.updateProfile = async (req, res, next) => {
  try {
    const { name, department } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.user.userId,
      { name, department, updatedAt: new Date() },
      { new: true }
    );

    res.json({
      message: 'Profile updated',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        batch: employee.batch,
        department: employee.department
      }
    });
  } catch (error) {
    next(error);
  }
};
