import React, { useState, useEffect } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material';
import { leaveService } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import TimelineIcon from '@mui/icons-material/Timeline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const fetchAllLeaves = async () => {
    try {
      setLoading(true);
      const { data } = await leaveService.getAllLeaves({ status: 'pending' });
      // Filter out leaves with null employee references
      const validLeaves = (data.leaves || []).filter(leave => leave.employee && leave.employee._id);
      setLeaves(validLeaves);
    } catch (err) {
      console.error('Failed to load leave requests', err);
      toast.error('Failed to load leave requests');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedLeave) return;

    try {
      await leaveService.approveLeave(selectedLeave._id);
      toast.success('Leave approved');
      setOpenApproveDialog(false);
      setSelectedLeave(null);
      fetchAllLeaves();
    } catch (err) {
      toast.error('Failed to approve leave');
    }
  };

  const handleReject = async () => {
    if (!selectedLeave) return;

    try {
      await leaveService.rejectLeave(selectedLeave._id);
      toast.success('Leave rejected');
      setOpenRejectDialog(false);
      setSelectedLeave(null);
      fetchAllLeaves();
    } catch (err) {
      toast.error('Failed to reject leave');
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');

  const getLeaveTypeEmoji = (type) => {
    const emojiMap = {
      casual: '😊',
      sick: '🏥',
      annual: '📅',
      unpaid: '💼'
    };
    return emojiMap[type] || '📋';
  };

  const getLeaveTypeColor = (type) => {
    const colorMap = {
      casual: { bg: 'rgba(79, 172, 254, 0.2)', text: '#0c4a6e' },
      sick: { bg: 'rgba(239, 68, 68, 0.2)', text: '#7f1d1d' },
      annual: { bg: 'rgba(34, 197, 94, 0.2)', text: '#14532d' },
      unpaid: { bg: 'rgba(168, 85, 247, 0.2)', text: '#581c87' }
    };
    return colorMap[type] || { bg: 'rgba(107, 114, 128, 0.2)', text: '#111827' };
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '20px',
        p: { xs: 3, md: 4 },
        mb: 4,
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(99, 102, 241, 0.3)',
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
            <TimelineIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Leave Approval
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '16px' }}>
            Review and approve employee leave requests
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
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
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
            borderBottom: '2px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
            <TimelineIcon sx={{ fontSize: 28, color: '#6366f1' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: '#312e81' }}>
              ⏳ Pending Leave Requests
            </Typography>
            <Chip
              label={pendingLeaves.length}
              size="small"
              sx={{ ml: 'auto', backgroundColor: 'rgba(99, 102, 241, 0.3)', color: '#312e81', fontWeight: 700 }}
            />
          </Box>
          {pendingLeaves.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                  <TableRow borderBottom="2px solid rgba(99, 102, 241, 0.2)">
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>👤 EMPLOYEE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📋 TYPE</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📅 FROM</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📅 TO</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>✍️ REASON</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }} align="right">⚡ ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingLeaves.map((leave) => (
                    <TableRow key={leave._id} sx={{
                      borderBottom: `1px solid rgba(99, 102, 241, 0.1)`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        boxShadow: 'inset 0 0 10px rgba(99, 102, 241, 0.15)'
                      }
                    }}>
                      <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>
                        {leave.employee?.name || 'Unknown Employee'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<Typography sx={{ fontSize: '14px !important' }}>{getLeaveTypeEmoji(leave.leaveType)}</Typography>}
                          label={leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            background: getLeaveTypeColor(leave.leaveType).bg,
                            color: getLeaveTypeColor(leave.leaveType).text
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>
                        {formatDate(leave.startDate)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>
                        {formatDate(leave.endDate)}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600, color: '#6b7280' }}>
                        {leave.reason}
                      </TableCell>
                      <TableCell align="right" sx={{ gap: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                          onClick={() => {
                            setSelectedLeave(leave);
                            setOpenApproveDialog(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                            }
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CancelIcon sx={{ fontSize: '16px !important' }} />}
                          onClick={() => {
                            setSelectedLeave(leave);
                            setOpenRejectDialog(true);
                          }}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            borderColor: '#ef4444',
                            color: '#dc2626',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#dc2626',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }
                          }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 48, color: 'rgba(99, 102, 241, 0.4)', mb: 1 }} />
              <Typography color="textSecondary" sx={{ fontWeight: 500 }}>
                No pending leave requests
              </Typography>
            </Box>
          )}
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: '18px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
          borderBottom: '2px solid rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CheckCircleIcon sx={{ color: '#10b981' }} />
          Approve Leave
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{
            p: 2.5,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            mb: 2
          }}>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Are you sure you want to approve leave for <strong>{selectedLeave?.employee?.name || 'Employee'}</strong>?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`From: ${formatDate(selectedLeave?.startDate)}`}
                size="small"
                sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#065f46', fontWeight: 600 }}
              />
              <Chip
                label={`To: ${formatDate(selectedLeave?.endDate)}`}
                size="small"
                sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#065f46', fontWeight: 600 }}
              />
            </Box>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            ℹ️ All seat bookings for this period will be automatically cancelled.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenApproveDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleApprove}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
              }
            }}
          >
            Approve Leave
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontWeight: 700,
          fontSize: '18px',
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)',
          borderBottom: '2px solid rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <CancelIcon sx={{ color: '#ef4444' }} />
          Reject Leave
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{
            p: 2.5,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            mb: 2
          }}>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              Are you sure you want to reject leave for <strong>{selectedLeave?.employee?.name || 'Employee'}</strong>?
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`From: ${formatDate(selectedLeave?.startDate)}`}
                size="small"
                sx={{ background: 'rgba(239, 68, 68, 0.2)', color: '#7f1d1d', fontWeight: 600 }}
              />
              <Chip
                label={`To: ${formatDate(selectedLeave?.endDate)}`}
                size="small"
                sx={{ background: 'rgba(239, 68, 68, 0.2)', color: '#7f1d1d', fontWeight: 600 }}
              />
            </Box>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            ℹ️ The employee will be notified about the rejection.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenRejectDialog(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleReject}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(239, 68, 68, 0.4)'
              }
            }}
          >
            Reject Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLeaves;
