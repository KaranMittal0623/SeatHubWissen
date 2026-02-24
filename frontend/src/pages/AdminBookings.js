import React, { useState, useEffect } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, Alert, Chip, TextField, Grid, Button } from '@mui/material';
import { adminService } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import AssignmentIcon from '@mui/icons-material/Assignment';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    batch: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getBookingsReport(filters);
      setBookings(data.bookings);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchBookings();
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 3,
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
            <AssignmentIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Bookings Report
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '16px' }}>
            Track and analyze all seat bookings
          </Typography>
        </Box>
      </Box>

      {/* Filters Section */}
      <Card sx={{
        p: 3,
        mb: 4,
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
          pb: 2,
          borderBottom: '2px solid rgba(245, 158, 11, 0.2)',
          mb: 2.5
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#92400e' }}>
            🔍 Filter Bookings
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.25)'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.25)'
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Batch"
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
              SelectProps={{ native: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(245, 158, 11, 0.25)'
                  }
                }
              }}
            >
              <option value="">All Batches</option>
              <option value="1">Batch 1</option>
              <option value="2">Batch 2</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                height: '56px',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)'
                }
              }}
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#f59e0b' }} />
        </Box>
      ) : (
        <Card sx={{
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
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
            borderBottom: '2px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
            <AssignmentIcon sx={{ fontSize: 28, color: '#f59e0b' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: '#92400e' }}>
              📍 All Bookings
            </Typography>
            <Chip
              label={bookings.length}
              size="small"
              sx={{ ml: 'auto', backgroundColor: 'rgba(245, 158, 11, 0.3)', color: '#92400e', fontWeight: 700 }}
            />
          </Box>
          {bookings.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableRow borderBottom="2px solid rgba(245, 158, 11, 0.2)">
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>👤 EMPLOYEE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🆔 EMPLOYEE ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📊 BATCH</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🪑 SEAT</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📅 DATE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🏷️ TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>✨ STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow key={booking._id} sx={{
                      borderBottom: `1px solid rgba(245, 158, 11, 0.1)`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(245, 158, 11, 0.08)',
                        boxShadow: `inset 0 0 10px rgba(245, 158, 11, 0.15)`
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>
                        {booking.employee.name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>
                        {booking.employee.employeeId}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Batch ${booking.employee.batch}`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            background: booking.employee.batch === '1'
                              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))'
                              : 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(147, 51, 234, 0.1))',
                            color: booking.employee.batch === '1' ? '#1e40af' : '#6b21a8'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#f59e0b', fontSize: '16px' }}>
                        {booking.seat.seatNumber}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>
                        {formatDate(booking.bookingDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.bookingType === 'designated' ? 'Designated' : 'Floater'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            background: booking.bookingType === 'designated'
                              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))'
                              : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))',
                            color: booking.bookingType === 'designated' ? '#1e40af' : '#92400e'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Active"
                          size="small"
                          sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))',
                            color: '#065f46'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 48, color: 'rgba(245, 158, 11, 0.4)', mb: 1 }} />
              <Typography color="textSecondary" sx={{ fontWeight: 500 }}>
                No bookings found
              </Typography>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
};

export default AdminBookings;
