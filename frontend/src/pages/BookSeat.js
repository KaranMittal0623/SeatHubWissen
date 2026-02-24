import React, { useState, useEffect } from 'react';
import { Box, Card, TextField, Button, Typography, Grid, CircularProgress, Alert, Chip } from '@mui/material';
import { bookingService } from '../services/api';
import useAuthStore from '../store/authStore';
import { formatDate, isDesignatedDay, getDayName, getWeekNumber } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChairIcon from '@mui/icons-material/Chair';

const BookSeat = () => {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingType, setBookingType] = useState('');

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSeat(null);
    setError('');

    if (!date) return;

    setLoading(true);
    try {
      const { data } = await bookingService.getAvailableSeats(date);
      setAvailableSeats(data.seats);
      
      // Determine booking type
      const bookDate = new Date(date);
      const isDesignated = isDesignatedDay(bookDate, user?.batch);
      const flotaerSeats = data.seats.filter(s => s.isFloater);
      const designatedSeats = data.seats.filter(s => !s.isFloater);
      
      if (isDesignated) {
        setBookingType('designated');
      } else {
        setBookingType('floater');
        if (flotaerSeats.length === 0) {
          setError('No floater seats available for this date. Can only book designated seats on your assigned days.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available seats');
      setAvailableSeats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeat = async () => {
    if (!selectedDate || !selectedSeat) {
      setError('Please select both date and seat');
      return;
    }

    setLoading(true);
    try {
      const { data } = await bookingService.bookSeat({
        seatId: selectedSeat._id,
        bookingDate: selectedDate
      });

      toast.success('Seat booked successfully!');
      setSelectedDate('');
      setSelectedSeat(null);
      setAvailableSeats([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book seat');
      setError(err.response?.data?.message || 'Failed to book seat');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDateInfo = () => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate);
    const isDesignated = isDesignatedDay(date, user?.batch);
    const week = getWeekNumber(date);
    return { isDesignated, week, day: getDayName(date) };
  };

  const dateInfo = getDateInfo();

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(37, 99, 235, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-150px',
          right: '-100px',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(20px)' }
          }
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <ChairIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Book Your Seat
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            Reserve your perfect workspace for the day
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85, display: 'flex', alignItems: 'center', gap: 1 }}>
            ✨ 50 seats available • {availableSeats.length} available today
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', animation: 'slideDown 0.3s ease-out' }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Date Selection */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 3,
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarMonthIcon sx={{ color: '#2563eb', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                Select Date
              </Typography>
            </Box>
            <TextField
              fullWidth
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              inputProps={{
                min: getTodayDate()
              }}
              label="Booking Date"
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)'
                  }
                }
              }}
            />

            {selectedDate && dateInfo && (
              <Box sx={{
                mt: 3,
                p: 2.5,
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(37, 99, 235, 0.2)',
                transition: 'all 0.3s ease',
                animation: 'slideUp 0.4s ease-out',
                '@keyframes slideUp': {
                  from: { opacity: 0, transform: 'translateY(10px)' },
                  to: { opacity: 1, transform: 'translateY(0)' }
                }
              }}>
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', fontWeight: 600 }}>DAY</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '16px', color: '#2563eb' }}>{dateInfo.day}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', fontWeight: 600 }}>WEEK</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '16px', color: '#7c3aed' }}>Week {dateInfo.week}</Typography>
                  </Grid>
                </Grid>
                <Chip
                  label={dateInfo.isDesignated ? '✅ Designated Day' : '🎯 Floater Seat Required'}
                  color={dateInfo.isDesignated ? 'success' : 'warning'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
                {!dateInfo.isDesignated && (
                  <Typography variant="body2" sx={{ mt: 1.5, color: '#f59e0b', fontWeight: 500 }}>
                    💡 Can book floater seat one day before after 3 PM
                  </Typography>
                )}
              </Box>
            )}
          </Card>
        </Grid>

        {/* Seat Selection */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 3,
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EventSeatIcon sx={{ color: '#2563eb', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                Select Seat
              </Typography>
            </Box>

            {loading && !selectedDate ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#2563eb' }} />
              </Box>
            ) : selectedDate && availableSeats.length > 0 ? (
              <Grid container spacing={2}>
                {availableSeats.map((seat) => (
                  <Grid item xs={6} sm={4} key={seat._id}>
                    <Card
                      onClick={() => setSelectedSeat(seat)}
                      sx={{
                        p: 2.5,
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: selectedSeat?._id === seat._id 
                          ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
                          : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        border: selectedSeat?._id === seat._id 
                          ? '2px solid #2563eb'
                          : '2px solid rgba(37, 99, 235, 0.1)',
                        borderRadius: '12px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
                          transform: 'translateY(-4px)',
                          border: '2px solid #2563eb'
                        }
                      }}
                    >
                      <EventSeatIcon sx={{
                        fontSize: 32,
                        color: selectedSeat?._id === seat._id 
                          ? 'white'
                          : seat.isFloater ? '#f59e0b' : '#2563eb',
                        mb: 1,
                        transition: 'color 0.3s'
                      }} />
                      <Typography variant="subtitle2" sx={{
                        fontWeight: 700,
                        color: selectedSeat?._id === seat._id ? 'white' : '#1f2937',
                        fontSize: '16px'
                      }}>
                        {seat.seatNumber}
                      </Typography>
                      <Chip
                        label={seat.isFloater ? 'Floater' : 'Regular'}
                        size="small"
                        color={seat.isFloater ? 'warning' : 'default'}
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          background: selectedSeat?._id === seat._id ? 'rgba(255, 255, 255, 0.3)' : 'transparent'
                        }}
                        variant={selectedSeat?._id === seat._id ? 'filled' : 'outlined'}
                      />
                      <Typography variant="body2" sx={{
                        mt: 1,
                        color: selectedSeat?._id === seat._id ? 'rgba(255, 255, 255, 0.85)' : 'textSecondary',
                        fontWeight: 500,
                        fontSize: '12px'
                      }}>
                        Floor {seat.floor} • {seat.zone}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : selectedDate ? (
              <Alert severity="warning" sx={{ borderRadius: '12px' }}>No seats available for this date</Alert>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ py: 3, textAlign: 'center' }}>
                📅 Select a date to view available seats
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Booking Summary */}
      {selectedSeat && selectedDate && (
        <Card sx={{
          mt: 4,
          p: 3.5,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          border: '2px solid rgba(37, 99, 235, 0.2)',
          boxShadow: '0 4px 20px rgba(37, 99, 235, 0.15)',
          animation: 'slideUp 0.4s ease-out',
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#2563eb' }}>
            ✨ Booking Summary
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(37, 99, 235, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>SEAT</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '18px', color: '#2563eb' }}>
                  {selectedSeat.seatNumber} <span style={{ fontSize: '14px', color: '#6b7280' }}>• Floor {selectedSeat.floor}</span>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, borderRadius: '12px', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.1)' }}>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>DATE</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '18px', color: '#7c3aed' }}>
                  {formatDate(selectedDate)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBookSeat}
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.8,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 35px rgba(37, 99, 235, 0.4)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '🎉 Confirm Booking'}
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
};

export default BookSeat;
