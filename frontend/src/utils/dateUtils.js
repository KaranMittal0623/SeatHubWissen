import { format, parse, isWeekend, isBefore, isAfter } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return 'N/A';
  return format(parsedDate, 'dd MMM yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return 'N/A';
  return format(parsedDate, 'dd MMM yyyy HH:mm');
};

export const getWeekNumber = (date) => {
  if (!date) return 1;
  const d = new Date(date);
  if (isNaN(d.getTime())) return 1;
  const dayOfMonth = d.getDate();
  return Math.ceil(dayOfMonth / 7);
};

export const getDesignatedDaysText = (batch, weekNumber) => {
  if (batch === 1) {
    return weekNumber === 1 ? 'Mon - Wed' : 'Thu - Fri';
  } else {
    return weekNumber === 1 ? 'Thu - Fri' : 'Mon - Wed';
  }
};

export const isDesignatedDay = (date, batch) => {
  const dayOfWeek = new Date(date).getDay();
  const weekNumber = getWeekNumber(date);
  
  const designatedDays = batch === 1
    ? (weekNumber === 1 ? [1, 2, 3] : [4, 5])
    : (weekNumber === 1 ? [4, 5] : [1, 2, 3]);
  
  return designatedDays.includes(dayOfWeek);
};

export const getDayName = (date) => {
  if (!date) return 'Unknown';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Unknown';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[d.getDay()];
};

export const getDateRange = (startDate, endDate) => {
  let current = new Date(startDate);
  const dates = [];
  while (isBefore(current, new Date(endDate)) || current.getTime() === new Date(endDate).getTime()) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};
