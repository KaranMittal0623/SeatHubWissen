import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Booking endpoints
export const bookingService = {
  getAvailableSeats: (date) => api.get('/bookings/available-seats', { params: { date } }),
  bookSeat: (data) => api.post('/bookings/book-seat', data),
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  cancelBooking: (bookingId, reason) => api.delete(`/bookings/cancel/${bookingId}`, { data: { reason } })
};

// Leave endpoints
export const leaveService = {
  requestLeave: (data) => api.post('/leaves/request', data),
  getMyLeaves: (params) => api.get('/leaves/my-leaves', { params }),
  cancelLeave: (leaveId) => api.delete(`/leaves/cancel/${leaveId}`),
  getAllLeaves: (params) => api.get('/leaves/all', { params }),
  approveLeave: (leaveId) => api.put(`/leaves/approve/${leaveId}`),
  rejectLeave: (leaveId) => api.put(`/leaves/reject/${leaveId}`)
};

// Admin endpoints
export const adminService = {
  createSeat: (data) => api.post('/admin/seats', data),
  getAllSeats: (params) => api.get('/admin/seats', { params }),
  updateSeat: (seatId, data) => api.put(`/admin/seats/${seatId}`, data),
  getAllEmployees: (params) => api.get('/admin/employees', { params }),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getBookingsReport: (params) => api.get('/admin/bookings-report', { params }),
  addHoliday: (data) => api.post('/admin/holidays', data),
  getHolidays: () => api.get('/admin/holidays'),
  approveLeave: (leaveId) => api.put(`/admin/leaves/approve/${leaveId}`),
  rejectLeave: (leaveId) => api.put(`/admin/leaves/reject/${leaveId}`)
};

export default api;
