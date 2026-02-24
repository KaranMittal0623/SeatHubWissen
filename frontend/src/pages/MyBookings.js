import React, { useEffect, useState } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip } from '@mui/material';
import { bookingService } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await bookingService.getMyBookings({ status: 'active' });
      setBookings(data.bookings);
      setError('');
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      await bookingService.cancelBooking(selectedBooking._id, cancelReason);
      toast.success('Booking cancelled successfully');
      setOpenDialog(false);
      setCancelReason('');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const upcomingBookings = bookings.filter(b => new Date(b.bookingDate) >= new Date());
  const pastBookings = bookings.filter(b => new Date(b.bookingDate) < new Date());

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(16, 185, 129, 0.3)',
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
            <EventNoteIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              My Bookings
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            View and manage all your seat reservations
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            📊 {bookings.length} total bookings • {upcomingBookings.length} upcoming
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#10b981' }} />
        </Box>
      ) : (
        <>
          {/* Upcoming Bookings */}
          <Card sx={{
            mb: 4,
            overflow: 'hidden',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            animation: 'slideUp 0.5s ease-out',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}>
            <Box sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderBottom: '2px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <EventNoteIcon sx={{ color: '#10b981', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: '#10b981' }}>
                ⏰ Upcoming Bookings
              </Typography>
              <Chip
                label={upcomingBookings.length}
                size="small"
                sx={{ ml: 'auto', backgroundColor: '#10b981', color: 'white', fontWeight: 700 }}
              />
            </Box>
            {upcomingBookings.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderBottom: '2px solid rgba(16, 185, 129, 0.1)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }}>📅 DATE</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }}>🪑 SEAT</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }}>📍 LOCATION</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }}>🏷️ TYPE</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }}>✨ STATUS</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#10b981', fontSize: '13px' }} align="right">⚙️ ACTION</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingBookings.map((booking) => (
                      <TableRow key={booking._id} sx={{
                        borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(16, 185, 129, 0.05)',
                          boxShadow: 'inset 0 0 10px rgba(16, 185, 129, 0.08)'
                        }
                      }}>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>{formatDate(booking.bookingDate)}</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '16px' }}>{booking.seat.seatNumber}</TableCell>
                        <TableCell sx={{ color: '#6b7280', fontWeight: 500 }}>Floor {booking.seat.floor} • {booking.seat.zone}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.bookingType === 'designated' ? '✅ Designated' : '🎯 Floater'}
                            size="small"
                            color={booking.bookingType === 'designated' ? 'success' : 'warning'}
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label="Active" color="success" size="small" sx={{ fontWeight: 600, backgroundColor: '#10b981' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            startIcon={<DeleteIcon sx={{ fontSize: 18 }} />}
                            size="small"
                            color="error"
                            onClick={() => handleCancelClick(booking)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '8px',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <EventNoteIcon sx={{ fontSize: 48, color: 'rgba(16, 185, 129, 0.3)', mb: 1 }} />
                <Typography color="textSecondary" sx={{ fontWeight: 500 }}>No upcoming bookings</Typography>
                <Typography variant="body2" color="textSecondary">Book a seat to get started!</Typography>
              </Box>
            )}
          </Card>

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <Card sx={{
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              animation: 'slideUp 0.5s ease-out 0.1s backwards',
              '@keyframes slideUp': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}>
              <Box sx={{
                p: 2.5,
                background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(156, 163, 175, 0.05) 100%)',
                borderBottom: '2px solid rgba(156, 163, 175, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}>
                <CheckCircleIcon sx={{ color: '#6b7280', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: '#6b7280' }}>
                  ✅ Past Bookings
                </Typography>
                <Chip
                  label={pastBookings.length}
                  size="small"
                  sx={{ ml: 'auto', backgroundColor: '#9ca3af', color: 'white', fontWeight: 700 }}
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: 'rgba(156, 163, 175, 0.05)', borderBottom: '2px solid rgba(156, 163, 175, 0.1)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '13px' }}>📅 DATE</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '13px' }}>🪑 SEAT</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '13px' }}>📍 LOCATION</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#6b7280', fontSize: '13px' }}>🏷️ TYPE</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pastBookings.map((booking) => (
                      <TableRow key={booking._id} sx={{
                        opacity: 0.75,
                        borderBottom: '1px solid rgba(156, 163, 175, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: 'rgba(156, 163, 175, 0.05)'
                        }
                      }}>
                        <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>{formatDate(booking.bookingDate)}</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '16px', color: '#1f2937' }}>{booking.seat.seatNumber}</TableCell>
                        <TableCell sx={{ color: '#9ca3af', fontWeight: 500 }}>Floor {booking.seat.floor}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.bookingType === 'designated' ? 'Designated' : 'Floater'}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)', borderBottom: '2px solid rgba(239, 68, 68, 0.1)' }}>
          ⚠️ Cancel Booking
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2.5 }}>
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: '12px' }}>
              This action cannot be undone. Your seat will become available for others.
            </Alert>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2.5, lineHeight: 1.6 }}>
              Are you sure you want to cancel your booking for <strong style={{ color: '#1f2937' }}>{selectedBooking?.seat.seatNumber}</strong> on <strong style={{ color: '#1f2937' }}>{formatDate(selectedBooking?.bookingDate)}</strong>?
            </Typography>
            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Tell us why you're cancelling..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.15)'
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            Keep Booking
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmCancel}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
              }
            }}
          >
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyBookings;
