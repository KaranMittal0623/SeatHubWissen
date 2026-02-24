import React, { useState } from 'react';
import { Box, Card, TextField, Button, Typography, Container, Alert, CircularProgress, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    batch: '1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.employeeId) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        employeeId: formData.employeeId,
        batch: parseInt(formData.batch)
      });

      setAuth(data.token, data.employee);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error('Registration failed');
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
      py: 4,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '-150px',
        left: '-100px',
        animation: 'float 8s ease-in-out infinite',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '50%',
        bottom: '-50px',
        right: '-50px',
        animation: 'float 6s ease-in-out infinite reverse',
      },
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(30px)' }
      }
    }}>
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Card sx={{
          p: { xs: 3, md: 4 },
          width: '100%',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          animation: 'slideUp 0.6s ease-out',
          '@keyframes slideUp': {
            from: {
              opacity: 0,
              transform: 'translateY(30px)'
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)'
            }
          }
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-1px' }}>
                SeatHub
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '14px' }}>
              Join the team and manage your office seating
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Email"
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
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Employee ID"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
            />

            <Box sx={{
              mt: 3,
              p: 2.5,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                border: '1px solid rgba(102, 126, 234, 0.4)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)'
              }
            }}>
              <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: '#667eea', fontSize: '13px' }}>
                📅 SELECT YOUR BATCH
              </Typography>
              <RadioGroup name="batch" value={formData.batch} onChange={handleChange} sx={{ gap: 1 }}>
                <FormControlLabel 
                  value="1" 
                  control={<Radio size="small" sx={{ color: '#667eea' }} />} 
                  label={<Typography variant="body2">Batch 1 (Mon-Wed Week 1, Thu-Fri Week 2)</Typography>}
                />
                <FormControlLabel 
                  value="2" 
                  control={<Radio size="small" sx={{ color: '#667eea' }} />} 
                  label={<Typography variant="body2">Batch 2 (Thu-Fri Week 1, Mon-Wed Week 2)</Typography>}
                />
              </RadioGroup>
            </Box>

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
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
                  }
                }
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.3)'
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
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
                },
                '&:active': {
                  transform: 'translateY(0)'
                }
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'textSecondary' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 700, transition: 'opacity 0.3s' }}>
                Login here
              </Link>
            </Typography>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
