const Employee = require('../models/Employee');
const Holiday = require('../models/Holiday');

// Check if date is holiday or weekend
const isHolidayOrWeekend = async (date) => {
  const dayOfWeek = date.getDay();
  
  // Check if weekend (Saturday=6, Sunday=0)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }
  
  // Check if holiday
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const holiday = await Holiday.findOne({
    date: { $gte: startOfDay, $lte: endOfDay }
  });
  
  return !!holiday;
};

// Validate date is in future
const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Format date for database queries
const getDateAtMidnight = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Calculate days in month between two dates (excluding weekends and holidays)
const calculateWorkDays = async (startDate, endDate) => {
  let count = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const isHoliday = await isHolidayOrWeekend(currentDate);
    if (!isHoliday) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};

module.exports = {
  isHolidayOrWeekend,
  isFutureDate,
  getDateAtMidnight,
  calculateWorkDays
};
