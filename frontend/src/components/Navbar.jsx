import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const loggedIn = localStorage.getItem('authToken');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/auth/logout');
      localStorage.removeItem('authToken');
      toast.success('Logout Successfully');
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error('Problem in Logout');
    }
  };

  return (
    <div>
      <Box
        width="100"
        p="1rem 6%"
        textAlign="center"
        sx={{ boxShadow: 3, mb: 2, bgcolor: 'purple', color: 'black' }}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography
          variant="h5"
          color="white"
          fontWeight="bold"
          component={RouterLink}
          to="/"
        >
          CHAT GPT3 CLONE
        </Typography>

        {loggedIn ? (
          <Button
            component={RouterLink}
            to="/login"
            onClick={handleLogout}
            sx={{ boxShadow: 3, bgcolor: 'white' }}
          >
            Logout
          </Button>
        ) : (
          <Typography display="flex" flexDirection="row" justifyContent="space-between">
            <Button
              sx={{ boxShadow: 3, mr: 2, bgcolor: 'white' }}
              fontWeight="bold"
              component={RouterLink}
              to="/signup"
            >
              Sign Up
            </Button>
            <Button
              sx={{ boxShadow: 3, mr: 2, bgcolor: 'white' }}
              fontWeight="bold"
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default Navbar;
