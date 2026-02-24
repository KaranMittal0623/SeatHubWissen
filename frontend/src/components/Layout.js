import React from 'react';
import { Box, Container, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import Header from './Header';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuthStore();

  const menuItems = isAdmin()
    ? [
        { label: 'Dashboard', icon: DashboardIcon, path: '/admin/dashboard' },
        { label: 'Bookings Report', icon: EventSeatIcon, path: '/admin/bookings' },
        { label: 'Employees', icon: PeopleIcon, path: '/admin/employees' },
        { label: 'Seats', icon: EventSeatIcon, path: '/admin/seats' },
        { label: 'Holidays', icon: EventNoteIcon, path: '/admin/holidays' },
        { label: 'Leaves', icon: AssignmentIcon, path: '/admin/leaves' }
      ]
    : [
        { label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
        { label: 'Book Seat', icon: EventSeatIcon, path: '/book-seat' },
        { label: 'My Bookings', icon: AssignmentIcon, path: '/my-bookings' },
        { label: 'Request Leave', icon: EventNoteIcon, path: '/request-leave' },
        { label: 'My Leaves', icon: AssignmentIcon, path: '/my-leaves' }
      ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 250,
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: { xs: 'none', sm: 'block' }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              fontSize: '1.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            SeatHub
          </Box>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? '#f0f4ff' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid #2563eb' : 'none',
                color: location.pathname === item.path ? '#2563eb' : '#6b7280',
                '&:hover': {
                  backgroundColor: '#f3f4f6'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 3, flex: 1 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
