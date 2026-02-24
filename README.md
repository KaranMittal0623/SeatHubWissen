# SeatHub - Office Seat Allocation System

A modern, feature-rich MERN stack application for managing office seat allocations with batch scheduling, leave management, and floater seat booking.

### Employee Features
- **Seat Booking**: Book seats according to your designated batch schedule
- **Floater Seats**: Book flexible seats on non-designated days (one day before after 3 PM)
- **Leave Management**: Request and track leaves with automatic seat release
- **Booking History**: View all past and upcoming bookings
- **Dashboard**: Real-time booking statistics and schedule overview

### Admin Features
- **Dashboard Analytics**: Track occupancy rates, bookings, and employee statistics
- **Seat Management**: Create and manage office seats (regular & floater)
- **Employee Management**: View all employees and their batch assignments
- **Leave Approval**: Review and approve/reject leave requests
- **Holiday Management**: Add and manage company holidays
- **Booking Reports**: Generate detailed booking reports with filters

### Batch Schedule
- **Batch 1**: Monday-Wednesday (Week 1) & Thursday-Friday (Week 2)
- **Batch 2**: Thursday-Friday (Week 1) & Monday-Wednesday (Week 2)

### Constraints
- Minimum 5 days in office per 2-week cycle
- 50 total seats (40 regular + 10 floater)
- 80 employees total (40 per batch)
- No booking on holidays/weekends

The frontend will open at `http://localhost:3000`

##  API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new employee
- `POST /api/auth/login` - Login to the system
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update profile

### Booking Endpoints
- `GET /api/bookings/available-seats?date=2024-01-15` - Get available seats for a date
- `POST /api/bookings/book-seat` - Book a seat
- `GET /api/bookings/my-bookings` - Get employee's bookings
- `DELETE /api/bookings/cancel/:bookingId` - Cancel a booking

### Leave Endpoints
- `POST /api/leaves/request` - Request leave
- `GET /api/leaves/my-leaves` - Get employee's leave requests
- `DELETE /api/leaves/cancel/:leaveId` - Cancel leave request
- `PUT /api/admin/leaves/approve/:leaveId` - Approve leave (Admin only)
- `PUT /api/admin/leaves/reject/:leaveId` - Reject leave (Admin only)

### Admin Endpoints
- `POST /api/admin/seats` - Create a seat
- `GET /api/admin/seats` - Get all seats
- `PUT /api/admin/seats/:seatId` - Update seat
- `GET /api/admin/employees` - Get all employees
- `GET /api/admin/dashboard-stats` - Get dashboard statistics
- `GET /api/admin/bookings-report` - Get bookings report
- `POST /api/admin/holidays` - Add holiday
- `GET /api/admin/holidays` - Get all holidays

##  UI/UX Features

- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Components**: Smooth transitions and hover effects
- **Color-coded Status**: Easy-to-understand seat and booking status indicators
- **Real-time Updates**: Instant feedback on user actions
- **Accessibility**: WCAG compliant for better accessibility

##  Database Schema

### Collections
1. **Employees**: User accounts and batch assignments
2. **Seats**: Office seat configurations (regular/floater)
3. **Bookings**: Seat reservations with dates and types
4. **Leaves**: Employee leave requests and approvals
5. **Holidays**: Company holidays and blocked dates

##  Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection
- Protected API endpoints

### Booking Validation
- Check if date is holiday/weekend
- Verify batch eligibility
- Ensure no duplicate bookings per day
- Validate floater seat timing (one day before after 3 PM)
- Check leave conflicts

### Leave Processing
- Auto-cancel affected bookings
- Track leave approvals
- Maintain leave history
- Calculate working days

## 🛠 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing

**Frontend:**
- React 18
- Material-UI v5
- React Router v6
- Axios for API calls
- React Hot Toast for notifications

##  Demo Credentials

**Admin:**
- Email: `admin@company.com`
- Password: `password`





