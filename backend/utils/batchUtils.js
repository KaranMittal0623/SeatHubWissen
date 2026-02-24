// Get designated days for a batch in a given week
const getDesignatedDays = (batch, weekNumber) => {
  // Batch 1: M-W (Week 1), Th-F (Week 2)
  // Batch 2: Th-F (Week 1), M-W (Week 2)
  
  if (batch === 1) {
    return weekNumber === 1 
      ? [1, 2, 3] // Monday, Tuesday, Wednesday
      : [4, 5];   // Thursday, Friday
  } else {
    return weekNumber === 1
      ? [4, 5]    // Thursday, Friday
      : [1, 2, 3]; // Monday, Tuesday, Wednesday
  }
};

// Check if a date is a designated day for employee's batch
const isDesignatedDay = (date, batch) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get week number (1 or 2)
  const dayOfMonth = date.getDate();
  const weekNumber = Math.ceil(dayOfMonth / 7);
  
  const designatedDays = getDesignatedDays(batch, weekNumber);
  
  // Convert dayOfWeek (0-6) to 1-7 (Monday=1)
  const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  return designatedDays.includes(adjustedDay);
};

// Check if can book floater seat (one day before after 3 PM)
const canBookFloaterSeat = (bookingDate) => {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  
  // Can only book if it's after 3 PM today for tomorrow
  const isAfter3PM = now.getHours() >= 15;
  const isOneDay = (bookingDate.getTime() - now.getTime()) <= oneDay && 
                   (bookingDate.getTime() - now.getTime()) > 0;
  
  return isAfter3PM && isOneDay;
};

// Get week number (1 or 2) of the month
const getWeekNumber = (date) => {
  return Math.ceil(date.getDate() / 7);
};

// Get day of week (1=Monday, 7=Sunday)
const getDayOfWeek = (date) => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 ? 7 : dayOfWeek;
};

module.exports = {
  getDesignatedDays,
  isDesignatedDay,
  canBookFloaterSeat,
  getWeekNumber,
  getDayOfWeek
};
