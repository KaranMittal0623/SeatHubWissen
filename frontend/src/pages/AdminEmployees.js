import React, { useState, useEffect } from 'react';
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, Chip } from '@mui/material';
import { adminService } from '../services/api';
import toast from 'react-hot-toast';
import PeopleIcon from '@mui/icons-material/People';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await adminService.getAllEmployees();
      setEmployees(data.employees);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const batch1Employees = employees.filter(e => e.batch === 1);
  const batch2Employees = employees.filter(e => e.batch === 2);

  const EmployeeTable = ({ title, icon: Icon, data, gradient, borderColor }) => (
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
        <Icon sx={{ fontSize: 28, color: borderColor.includes('rgb(59, 130, 246)') ? '#3b82f6' : '#9333ea' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, m: 0, color: borderColor.includes('rgb(59, 130, 246)') ? '#1e40af' : '#6b21a8' }}>
          {title}
        </Typography>
        <Chip
          label={data.length}
          size="small"
          sx={{ ml: 'auto', backgroundColor: borderColor, color: 'white', fontWeight: 700 }}
        />
      </Box>
      {data.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableRow borderBottom={`2px solid ${borderColor}`}>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>👤 NAME</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🆔 EMPLOYEE ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>📧 EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>🏢 DEPARTMENT</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '13px' }}>✨ STATUS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((employee) => (
                <TableRow key={employee._id} sx={{
                  borderBottom: `1px solid ${borderColor}30`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${borderColor}08`,
                    boxShadow: `inset 0 0 10px ${borderColor}15`
                  }
                }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937', fontSize: '16px' }}>{employee.name}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>{employee.employeeId}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '13px' }}>{employee.email}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#6b7280' }}>{employee.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={employee.isActive ? 'Active' : 'Inactive'}
                      color={employee.isActive ? 'success' : 'default'}
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
            No employees found
          </Typography>
        </Box>
      )}
    </Card>
  );

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
            <PeopleIcon sx={{ fontSize: 36 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-1px', mb: 0 }}>
              Employee Management
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.95, fontSize: '16px' }}>
            Manage and monitor all employees
          </Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#2563eb' }} />
        </Box>
      ) : (
        <>
          <EmployeeTable
            title="🔷 Batch 1 Employees"
            icon={PeopleIcon}
            data={batch1Employees}
            gradient="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)"
            borderColor="rgba(59, 130, 246, 0.5)"
          />
          <EmployeeTable
            title="🔶 Batch 2 Employees"
            icon={PeopleIcon}
            data={batch2Employees}
            gradient="linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)"
            borderColor="rgba(147, 51, 234, 0.5)"
          />
        </>
      )}
    </Box>
  );
};

export default AdminEmployees;
