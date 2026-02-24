import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Container, Alert, CircularProgress } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.login(formData);
      setAuth(data.token, data.employee);
      toast.success('Login successful!');
      navigate(data.employee.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '-100px',
        right: '-100px',
        animation: 'float 6s ease-in-out infinite'
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(20px)' }
      }
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          p: 4, 
          width: '100%', 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
          animation: 'slideUp 0.6s ease-out',
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              px: 3, 
              py: 2, 
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              display: 'inline-block',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-1px'
                }}
              >
                SeatHub
              </Typography>
            </Box>
            <Typography variant="body1" color="textSecondary" sx={{ fontSize: '16px', mt: 2 }}>
              Smart Seat Allocation System
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ 
              mb: 3,
              borderRadius: '12px',
              animation: 'slideDown 0.3s ease-out',
              '@keyframes slideDown': {
                from: { opacity: 0, transform: 'translateY(-10px)' },
                to: { opacity: 1, transform: 'translateY(0)' }
              }
            }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 5px 20px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 5px 20px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 4, 
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '16px',
                textTransform: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 4, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ 
              color: '#667eea', 
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              '&:hover': { color: '#764ba2' }
            }}>
              Register here
            </Link>
          </Typography>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #f0f0f0' }}>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1.5, fontSize: '12px' }}>
              📧 Demo Credentials:
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontSize: '11px', color: '#667eea', fontFamily: 'monospace', mb: 0.5 }}>
              Admin: admin@company.com
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', fontSize: '11px', color: '#667eea', fontFamily: 'monospace' }}>
              Password: password
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
