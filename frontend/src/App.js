import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { theme } from './styles/theme';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import BookSeat from './pages/BookSeat';
import MyBookings from './pages/MyBookings';
import RequestLeave from './pages/RequestLeave';
import MyLeaves from './pages/MyLeaves';
import AdminDashboard from './pages/AdminDashboard';
import AdminSeats from './pages/AdminSeats';
import AdminBookings from './pages/AdminBookings';
import AdminEmployees from './pages/AdminEmployees';
import AdminHolidays from './pages/AdminHolidays';
import AdminLeaves from './pages/AdminLeaves';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employee Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmployeeDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-seat"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookSeat />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyBookings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-leave"
            element={
              <ProtectedRoute>
                <Layout>
                  <RequestLeave />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyLeaves />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/seats"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminSeats />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminBookings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminEmployees />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/holidays"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminHolidays />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute adminOnly={true}>
                <Layout>
                  <AdminLeaves />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
