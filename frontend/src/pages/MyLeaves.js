import React, { useState, useEffect } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import { leaveService } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const { data } = await leaveService.getMyLeaves();
      setLeaves(data.leaves);
    } catch (err) {
      setError('Failed to load leave history');
    } finally {
      setLoading(false);
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending');
  const approvedLeaves = leaves.filter(l => l.status === 'approved');
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected');

  const LeaveTable = ({ title, icon: Icon, data, gradient, borderColor, statusColor, emptyMessage }) => (
    <Card sx={{
      mt: 3,
      overflow: 'hidden',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: `1px solid ${borderColor}`,
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
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🏷️ TYPE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📅 FROM</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📅 TO</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>💬 REASON</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>✨ STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((leave, idx) => (
                <TableRow
                  key={leave._id}
                  sx={{
                    borderBottom: `1px solid ${borderColor}30`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: `${borderColor}08`,
                      boxShadow: `inset 0 0 10px ${borderColor}15`
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#6b7280' }}>
                    {formatDate(leave.startDate)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#6b7280' }}>
                    {formatDate(leave.endDate)}
                  </TableCell>
                  <TableCell sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    {leave.reason}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      color={statusColor}
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
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Card>
  );

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
              Leave History
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            Track all your leave requests and approvals
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            📊 {leaves.length} total requests • {approvedLeaves.length} approved
          </Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#6366f1' }} />
        </Box>
      ) : (
        <>
          {pendingLeaves.length > 0 && (
            <LeaveTable
              title="⏳ Pending Requests"
              icon={HistoryIcon}
              data={pendingLeaves}
              gradient="linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)"
              borderColor="rgba(245, 158, 11, 0.3)"
              statusColor="warning"
              emptyMessage="No pending requests"
            />
          )}
          {approvedLeaves.length > 0 && (
            <LeaveTable
              title="✅ Approved Leaves"
              icon={HistoryIcon}
              data={approvedLeaves}
              gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"
              borderColor="rgba(16, 185, 129, 0.3)"
              statusColor="success"
              emptyMessage="No approved leaves"
            />
          )}
          {rejectedLeaves.length > 0 && (
            <LeaveTable
              title="❌ Rejected Requests"
              icon={HistoryIcon}
              data={rejectedLeaves}
              gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)"
              borderColor="rgba(239, 68, 68, 0.3)"
              statusColor="error"
              emptyMessage="No rejected leaves"
            />
          )}
          {leaves.length === 0 && (
            <Card sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <TimelineIcon sx={{ fontSize: 48, color: 'rgba(99, 102, 241, 0.3)', mb: 1 }} />
              <Typography color="textSecondary" sx={{ fontWeight: 500, fontSize: '16px' }}>
                No leave requests found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Ready to take some time off? Create a leave request to get started!
              </Typography>
            </Card>
          )}
        </>
      )}
    </Box>
  );
};

export default MyLeaves;
