import React, { useState, useEffect } from 'react';
import { Box, Card, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, Chip } from '@mui/material';
import { adminService } from '../services/api';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import EventSeatIcon from '@mui/icons-material/EventSeat';

const AdminSeats = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    seatNumber: '',
    floor: '',
    zone: '',
    isFloater: false
  });

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getAllSeats();
      setSeats(data.seats);
    } catch (err) {
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.seatNumber || !formData.floor || !formData.zone) {
      toast.error('All fields are required');
      return;
    }

    try {
      await adminService.createSeat(formData);
      toast.success('Seat created successfully');
      setFormData({ seatNumber: '', floor: '', zone: '', isFloater: false });
      setOpenDialog(false);
      fetchSeats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create seat');
    }
  };

  const regularSeats = seats.filter(s => !s.isFloater);
  const floaterSeats = seats.filter(s => s.isFloater);

  const SeatTable = ({ title, icon: Icon, data, gradient, borderColor }) => (
    <Card sx={{
      mb: 3,
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
        background: gradient,
        borderBottom: `2px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Icon sx={{ fontSize: 28, color: 'white' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: 'white' }}>
          {title}
        </Typography>
        <Chip
          label={data.length}
          size="small"
          sx={{ ml: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.3)', color: 'white', fontWeight: 700 }}
        />
      </Box>
      {data.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableRow borderBottom={`2px solid ${borderColor}`}>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🪑 SEAT NUMBER</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📍 FLOOR</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📂 ZONE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>✨ STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((seat) => (
                <TableRow key={seat._id} sx={{
                  borderBottom: `1px solid ${borderColor}30`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${borderColor}08`,
                    boxShadow: `inset 0 0 10px ${borderColor}15`
                  }
                }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>{seat.seatNumber}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>{seat.floor}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>{seat.zone}</TableCell>
                  <TableCell>
                    <Chip
                      label={seat.isActive ? 'Active' : 'Inactive'}
                      color={seat.isActive ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Icon sx={{ fontSize: 48, color: `${borderColor}40`, mb: 1 }} />
          <Typography color="textSecondary" sx={{ fontWeight: 500 }}>
            No seats found
          </Typography>
        </Box>
      )}
    </Card>
  );

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(59, 130, 246, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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
            <EventSeatIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Seat Management
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            Create and manage office seating
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 600,
            borderRadius: '12px',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            },
            position: 'relative',
            zIndex: 1,
            whiteSpace: 'nowrap'
          }}
        >
          Add Seat
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#3b82f6' }} />
        </Box>
      ) : (
        <>
          <SeatTable
            title="📍 Regular Seats"
            icon={EventSeatIcon}
            data={regularSeats}
            gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)"
            borderColor="rgba(59, 130, 246, 0.3)"
          />
          <SeatTable
            title="🎯 Floater Seats"
            icon={EventSeatIcon}
            data={floaterSeats}
            gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"
            borderColor="rgba(245, 158, 11, 0.3)"
          />
        </>
      )}

      {/* Add Seat Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: '18px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
          borderBottom: '2px solid rgba(59, 130, 246, 0.1)'
        }}>
          ➕ Add New Seat
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Seat Number"
              name="seatNumber"
              value={formData.seatNumber}
              onChange={handleChange}
              placeholder="e.g., F1-A01"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.25)'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Floor"
              name="floor"
              type="number"
              value={formData.floor}
              onChange={handleChange}
              inputProps={{ min: 1 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.25)'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              placeholder="e.g., A, B, Flex"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(59, 130, 246, 0.25)'
                  }
                }
              }}
            />
            <Box sx={{
              p: 2,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                border: '1px solid rgba(59, 130, 246, 0.4)',
              }
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isFloater"
                    checked={formData.isFloater}
                    onChange={handleChange}
                    sx={{
                      color: '#3b82f6',
                      '&.Mui-checked': {
                        color: '#3b82f6'
                      }
                    }}
                  />
                }
                label={<Typography sx={{ fontWeight: 600 }}>🎯 This is a floater seat</Typography>}
              />
            </Box>
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
              }
            }}
          >
            Add Seat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSeats;
