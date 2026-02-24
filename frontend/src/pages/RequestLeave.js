import React, { useState, useEffect } from 'react';
import { Box, Card, TextField, Button, Typography, Grid, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Chip, CircularProgress } from '@mui/material';
import { leaveService } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

const RequestLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const { data } = await leaveService.getMyLeaves();
      setLeaves(data.leaves);
    } catch (err) {
      toast.error('Failed to load leave requests');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('All fields are required');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      await leaveService.requestLeave(formData);
      toast.success('Leave request submitted');
      setFormData({ leaveType: 'casual', startDate: '', endDate: '', reason: '' });
      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLeave = async () => {
    if (!selectedLeave) return;

    try {
      await leaveService.cancelLeave(selectedLeave._id);
      toast.success('Leave request cancelled');
      setOpenDialog(false);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      toast.error('Failed to cancel leave request');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');

  const leaveTypeColors = {
    casual: { bg: '#dbeafe', border: '#3b82f6', color: '#2563eb' },
    sick: { bg: '#fecaca', border: '#f87171', color: '#dc2626' },
    annual: { bg: '#dbeafe', border: '#3b82f6', color: '#2563eb' },
    unpaid: { bg: '#f3f4f6', border: '#9ca3af', color: '#6b7280' }
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
            <EventAvailableIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Request Leave
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            Take time off and manage your absence
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            📊 {leaves.length} total requests • {pendingLeaves.length} pending
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Request Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 3.5,
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            animation: 'slideUp 0.5s ease-out',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <EventAvailableIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                Submit Leave Request
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                select
                fullWidth
                label="Leave Type"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                SelectProps={{
                  native: true
                }}
                margin="normal"
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
                <option value="casual">😊 Casual Leave</option>
                <option value="sick">🏥 Sick Leave</option>
                <option value="annual">📅 Annual Leave</option>
                <option value="unpaid">💼 Unpaid Leave</option>
              </TextField>

              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTodayDate() }}
                margin="normal"
                required
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

              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || getTodayDate() }}
                margin="normal"
                required
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

              <TextField
                fullWidth
                label="Reason"
                name="reason"
                multiline
                rows={4}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide the reason for your leave..."
                margin="normal"
                required
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

              <Alert severity="info" sx={{
                mt: 2.5,
                mb: 2.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                '& .MuiAlert-icon': {
                  color: '#3b82f6'
                }
              }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  💡 All bookings for the leave period will be automatically cancelled and your seat will be released for others.
                </Typography>
              </Alert>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  mt: 0.5,
                  py: 1.8,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 35px rgba(245, 158, 11, 0.4)'
                  },
                  '&:active': {
                    transform: 'translateY(0)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : '📤 Submit Request'}
              </Button>
            </form>
          </Card>
        </Grid>

        {/* Requests List */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 3.5,
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            animation: 'slideUp 0.5s ease-out 0.1s backwards',
            '@keyframes slideUp': {
              from: { opacity: 0, transform: 'translateY(20px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
              <HourglassBottomIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                My Requests
              </Typography>
              <Chip
                label={leaves.length}
                size="small"
                sx={{ ml: 'auto', backgroundColor: '#f59e0b', color: 'white', fontWeight: 700 }}
              />
            </Box>

            {leaves.length > 0 ? (
              <Box>
                {pendingLeaves.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '12px'
                    }}>
                      ⏳ PENDING ({pendingLeaves.length})
                    </Typography>
                    {pendingLeaves.map((leave) => (
                      <Card key={leave._id} sx={{
                        p: 2.5,
                        mb: 1.5,
                        backgroundColor: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%)',
                        border: '2px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          border: '2px solid rgba(245, 158, 11, 0.4)',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
                        }
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 1.5 }}>
                          <Box sx={{ flex: 1 }}>
                            <Chip
                              label={`${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave`}
                              size="small"
                              sx={{
                                fontWeight: 700,
                                backgroundColor: leaveTypeColors[leave.leaveType]?.bg,
                                color: leaveTypeColors[leave.leaveType]?.color,
                                border: `2px solid ${leaveTypeColors[leave.leaveType]?.border}`,
                                mb: 1
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                              {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                              {leave.reason}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                            onClick={() => {
                              setSelectedLeave(leave);
                              setOpenDialog(true);
                            }}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '8px',
                              transition: 'all 0.3s ease',
                              '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' }
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                )}

                {approvedLeaves.length > 0 && (
                  <Box>
                    <Typography variant="body2" sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: '12px'
                    }}>
                      ✅ APPROVED ({approvedLeaves.length})
                    </Typography>
                    {approvedLeaves.map((leave) => (
                      <Card key={leave._id} sx={{
                        p: 2.5,
                        mb: 1.5,
                        backgroundColor: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)',
                        border: '2px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          border: '2px solid rgba(16, 185, 129, 0.4)',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                        }
                      }}>
                        <Chip
                          label={`${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)} Leave`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: '#d1fae5',
                            color: '#10b981',
                            border: '2px solid #6ee7b7',
                            mb: 1
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                          {formatDate(leave.startDate)} → {formatDate(leave.endDate)}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 500 }}>
                          {leave.reason}
                        </Typography>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <EventAvailableIcon sx={{ fontSize: 48, color: 'rgba(245, 158, 11, 0.3)', mb: 1 }} />
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>No leave requests yet</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Cancel Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '18px', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)', borderBottom: '2px solid rgba(245, 158, 11, 0.1)' }}>
          ⚠️ Cancel Leave Request
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2.5 }}>
            <Alert severity="warning" sx={{ mb: 2.5, borderRadius: '12px' }}>
              This action will cancel your leave request and any affected bookings will be restored.
            </Alert>
            <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6 }}>
              Are you sure you want to cancel your leave request for <strong style={{ color: '#1f2937' }}>{formatDate(selectedLeave?.startDate)}</strong> to <strong style={{ color: '#1f2937' }}>{formatDate(selectedLeave?.endDate)}</strong>?
            </Typography>
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
            Keep Request
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelLeave}
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
            Cancel Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestLeave;
