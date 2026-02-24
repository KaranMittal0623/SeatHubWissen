import React, { useState, useEffect } from 'react';
import { Box, Card, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { adminService } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import EventIcon from '@mui/icons-material/Event';
import AddIcon from '@mui/icons-material/Add';

const AdminHolidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    name: ''
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getHolidays();
      setHolidays(data.holidays);
    } catch (err) {
      toast.error('Failed to load holidays');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.name) {
      toast.error('All fields are required');
      return;
    }

    try {
      await adminService.addHoliday(formData);
      toast.success('Holiday added successfully');
      setFormData({ date: '', name: '' });
      setOpenDialog(false);
      fetchHolidays();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add holiday');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3)',
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
            <EventIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Holiday Management
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            Configure company holidays and special dates
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
          Add Holiday
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#8b5cf6' }} />
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
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
            borderBottom: '2px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
            <EventIcon sx={{ fontSize: 28, color: '#8b5cf6' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: '#5b21b6' }}>
              📍 All Holidays
            </Typography>
            <Chip
              label={holidays.length}
              size="small"
              sx={{ ml: 'auto', backgroundColor: 'rgba(139, 92, 246, 0.3)', color: '#5b21b6', fontWeight: 700 }}
            />
          </Box>
          {holidays.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableRow borderBottom="2px solid rgba(139, 92, 246, 0.2)">
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📅 DATE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🎉 HOLIDAY NAME</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {holidays.map((holiday) => (
                    <TableRow key={holiday._id} sx={{
                      borderBottom: 'rgba(139, 92, 246, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        boxShadow: 'inset 0 0 10px rgba(139, 92, 246, 0.15)'
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>
                        {formatDate(holiday.date)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>
                        {holiday.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 48, color: 'rgba(139, 92, 246, 0.4)', mb: 1 }} />
              <Typography color="textSecondary" sx={{ fontWeight: 500 }}>
                No holidays configured
              </Typography>
            </Box>
          )}
        </Card>
      )}

      {/* Add Holiday Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: '18px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)',
          borderBottom: '2px solid rgba(139, 92, 246, 0.1)'
        }}>
          ➕ Add New Holiday
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getTodayDate() }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(139, 92, 246, 0.25)'
                  }
                }
              }}
            />
            <TextField
              fullWidth
              label="Holiday Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Diwali"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(139, 92, 246, 0.25)'
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
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)'
              }
            }}
          >
            Add Holiday
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminHolidays;
