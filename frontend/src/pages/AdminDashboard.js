import React, { useEffect, useState } from 'react';
import { Box, Card, Grid, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { adminService } from '../services/api';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      if (!refreshing) setLoading(true);
      const [statsData, empData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllEmployees()
      ]);
      setStats(statsData.data.stats);
      setEmployees(empData.data.employees || []);
    } catch (err) {
      console.error('Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const StatCard = ({ icon: Icon, title, value, unit = '', color, gradient }) => (
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
        {value}{unit}
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
        {title}
      </Typography>
    </Card>
  );

  const EmployeeTable = ({ batch, employees }) => (
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
        background: batch === 1 
          ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
        borderBottom: batch === 1 ? '2px solid rgba(37, 99, 235, 0.2)' : '2px solid rgba(168, 85, 247, 0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5
      }}>
        <PeopleIcon sx={{ color: batch === 1 ? '#2563eb' : '#a855f7', fontSize: 28 }} />
        <Typography variant="h6" sx={{
          fontWeight: 700, m: 0,
          color: batch === 1 ? '#2563eb' : '#a855f7'
        }}>
          {batch === 1 ? '👥 Batch 1 Employees' : '👥 Batch 2 Employees'}
        </Typography>
        <Chip
          label={employees.length}
          size="small"
          sx={{
            ml: 'auto',
            backgroundColor: batch === 1 ? '#2563eb' : '#a855f7',
            color: 'white',
            fontWeight: 700
          }}
        />
      </Box>
      {employees.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead sx={{
              backgroundColor: batch === 1 
                ? 'rgba(37, 99, 235, 0.05)'
                : 'rgba(168, 85, 247, 0.05)',
              borderBottom: batch === 1
                ? '2px solid rgba(37, 99, 235, 0.1)'
                : '2px solid rgba(168, 85, 247, 0.1)'
            }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: batch === 1 ? '#2563eb' : '#a855f7', fontSize: '13px' }}>👤 NAME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: batch === 1 ? '#2563eb' : '#a855f7', fontSize: '13px' }}>🆔 ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: batch === 1 ? '#2563eb' : '#a855f7', fontSize: '13px' }}>📧 EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: batch === 1 ? '#2563eb' : '#a855f7', fontSize: '13px' }}>🏢 DEPT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: batch === 1 ? '#2563eb' : '#a855f7', fontSize: '13px' }}>✨ STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp._id} sx={{
                  borderBottom: batch === 1
                    ? '1px solid rgba(37, 99, 235, 0.1)'
                    : '1px solid rgba(168, 85, 247, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: batch === 1
                      ? 'rgba(37, 99, 235, 0.05)'
                      : 'rgba(168, 85, 247, 0.05)',
                    boxShadow: batch === 1
                      ? 'inset 0 0 10px rgba(37, 99, 235, 0.08)'
                      : 'inset 0 0 10px rgba(168, 85, 247, 0.08)'
                  }
                }}>
                  <TableCell sx={{ fontWeight: 600, color: '#1f2937' }}>{emp.name}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#6b7280' }}>{emp.employeeId}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '14px' }}>{emp.email}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#6b7280' }}>{emp.department || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={emp.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={emp.isActive ? 'success' : 'default'}
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
          <PeopleIcon sx={{ fontSize: 48, color: 'rgba(156, 163, 175, 0.3)', mb: 1 }} />
          <Typography color="textSecondary" sx={{ fontWeight: 500 }}>No employees found</Typography>
        </Box>
      )}
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#2563eb' }} />
      </Box>
    );
  }

  const batch1Employees = employees.filter(emp => emp.batch === 1 && emp.role === 'employee');
  const batch2Employees = employees.filter(emp => emp.batch === 2 && emp.role === 'employee');

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
            <DashboardIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, mb: 1, fontSize: '16px' }}>
            System overview and employee management
          </Typography>
        </Box>
        <Tooltip title="Refresh data">
          <Button
            variant="contained"
            startIcon={<RefreshIcon sx={{
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } }
            }} />}
            onClick={handleRefresh}
            disabled={refreshing}
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
              zIndex: 1
            }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </Tooltip>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            title="Total Employees"
            value={stats?.totalEmployees || 0}
            color="#2563eb"
            gradient={['#2563eb', '#1e40af']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={EventNoteIcon}
            title="Total Seats"
            value={stats?.totalSeats || 0}
            color="#7c3aed"
            gradient={['#7c3aed', '#6d28d9']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={EventNoteIcon}
            title="Available Today"
            value={stats?.availableSeatsToday || 0}
            color="#10b981"
            gradient={['#10b981', '#059669']}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={DashboardIcon}
            title="Occupancy Rate"
            value={stats?.occupancyRate || 0}
            unit="%"
            color="#f59e0b"
            gradient={['#f59e0b', '#d97706']}
          />
        </Grid>
      </Grid>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 3.5,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            border: '2px solid rgba(37, 99, 235, 0.2)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '2px solid rgba(37, 99, 235, 0.4)',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.2)'
            }
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#2563eb' }}>
              📋 Today's Bookings
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2563eb' }}>
                {stats?.bookedSeatsToday || 0}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                out of {stats?.totalSeats || 0} seats booked
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: 3.5,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
            border: '2px solid rgba(168, 85, 247, 0.2)',
            boxShadow: '0 4px 20px rgba(168, 85, 247, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '2px solid rgba(168, 85, 247, 0.4)',
              boxShadow: '0 8px 30px rgba(168, 85, 247, 0.2)'
            }
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#a855f7' }}>
              👥 Batch Distribution
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>Batch 1</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2563eb' }}>
                  {stats?.batchDistribution?.batch1 || 0}
                </Typography>
              </Box>
              <Box sx={{ borderLeft: '2px solid rgba(168, 85, 247, 0.2)', pl: 3 }}>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 0.5 }}>Batch 2</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#a855f7' }}>
                  {stats?.batchDistribution?.batch2 || 0}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Batch 1 & 2 Employees Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <EmployeeTable batch={1} employees={batch1Employees} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <EmployeeTable batch={2} employees={batch2Employees} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
