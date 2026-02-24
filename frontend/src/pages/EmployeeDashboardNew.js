import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { bookingService } from '../services/api';
import useAuthStore from '../store/authStore';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';

const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data } = await bookingService.getMyBookings({ status: 'active' });
      
      // Calculate stats
      const upcomingBookings = data.bookings.filter(b => new Date(b.bookingDate) >= new Date(today));
      const thisMonthBookings = data.bookings.filter(b => {
        const bookDate = new Date(b.bookingDate);
        const now = new Date();
        return bookDate.getMonth() === now.getMonth() && bookDate.getFullYear() === now.getFullYear();
      });

      setStats({
        totalBookings: data.bookings.length,
        upcomingBookings: upcomingBookings.length,
        thisMonthBookings: thisMonthBookings.length
      });
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, gradient }) => (
    <Card sx={{
      p: 3,
      textAlign: 'center',
      background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      borderRadius: '16px',
      boxShadow: `0 10px 30px ${color}20`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      border: 'none',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 20px 50px ${color}30`,
      }
    }}>
      <Box sx={{
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 'auto',
        mb: 1.5,
        backdropFilter: 'blur(10px)'
      }}>
        <Icon sx={{ fontSize: 32, color: 'white' }} />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
        {title}
      </Typography>
    </Card>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(102, 126, 234, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-100px',
          right: '-100px',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(20px)' }
          }
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-1px' }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 2, fontSize: '16px' }}>
            Here's your seat booking overview
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 1 }}>
            📋 Minimum 5 days in office per 2-week cycle required
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      ) : (
        <>
          {/* Stats Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={EventSeatIcon} 
                title="Total Bookings" 
                value={stats?.totalBookings || 0}
                color="#667eea"
                gradient={['#667eea', '#764ba2']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={CheckCircleIcon} 
                title="Upcoming" 
                value={stats?.upcomingBookings || 0}
                color="#10b981"
                gradient={['#10b981', '#059669']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={CalendarMonthIcon} 
                title="This Month" 
                value={stats?.thisMonthBookings || 0}
                color="#f59e0b"
                gradient={['#f59e0b', '#d97706']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard 
                icon={GroupIcon} 
                title="Your Batch" 
                value={user?.batch}
                color="#f97316"
                gradient={['#f97316', '#ea580c']}
              />
            </Grid>
          </Grid>

          {/* Info Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%)',
                border: '2px solid rgba(102, 126, 234, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '2px solid rgba(102, 126, 234, 0.4)',
                  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)'
                }
              }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#667eea', display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⏰ Quick Actions
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                  • <strong>Book Seat</strong> - Reserve seats for your designated days
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                  • <strong>Floater Seats</strong> - Available one day before after 3 PM
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • <strong>Request Leave</strong> - Auto-cancels bookings for leave period
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{
                p: 3,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)'
                }
              }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: '#10b981', display: 'flex', alignItems: 'center', gap: 1 }}>
                  📅 Your Schedule
                </Typography>
                {user?.batch === 1 ? (
                  <>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                      <strong>Week 1:</strong> Mon · Tue · Wed
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Week 2:</strong> Thu · Fri
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                      <strong>Week 1:</strong> Thu · Fri
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Week 2:</strong> Mon · Tue · Wed
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default EmployeeDashboard;
