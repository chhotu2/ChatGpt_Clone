import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, useTheme, useMediaQuery, TextField, Button, Alert } from '@mui/material'
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Otp from './Otp';
import { useEffect } from 'react';


const Signup = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isNotMobile = useMediaQuery("(min-width: 1000px)");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobilenumber] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);


  // useEffect(() => {
  //   if (showOtp) {
  //     navigate('/otp');
  //   }
  // }, [showOtp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data1 } = await axios.post('/api/v1/auth/sendotp', { email });
      const { data2 } = await axios.post('/api/v1/auth/sendmobileotp', { mobileNumber });
      // if (!data1 || data2) {
      //   toast.error("User Alreeady Exists");
      //   return
      // }
      setShowOtp(true);
      toast.success("OTP Sent Successfully");
      //  navigate('/otp');  
    } catch (err) {
      setLoading(false);
      console.log(err); // Corrected variable name from `error` to `err`
      if (err.response.data.error) {

        setError(err.response.data.error);
      } else if (err.message) {
        toast.error("User Alreeady Exists");
        setError(err.message);
      }
      setTimeout(() => 
      {
        setError("");
      }, 5000);
    }
  };


  // if (showOtp) {
  //   navigate('/otp');
  // }

  return (
    <Box
      width={isNotMobile ? '40%' : '80%'}
      p={'2rem'}
      m={'2rem auto'}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      backgroundColor={theme.palette.background.alt}
    >
      <form onSubmit={handleSubmit}>
        <Typography variant='h3'>Sign Up</Typography>
        <TextField
          label="email"
          type='email'
          required
          margin='normal'
          fullWidth
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />
        <TextField
          label="password"
          type='password'
          required
          margin='normal'
          fullWidth
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
        <TextField
          label="mobile"
          type='number'
          required
          margin='normal'
          fullWidth
          value={mobileNumber}
          onChange={(e) => { setMobilenumber(e.target.value) }}
        />
        <Button type='submit' fullWidth variant='contained' size='large' sx={{ color: 'white', mt: 2 }} disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>


      {error && <Alert severity="error">{error}</Alert>}
      <Typography sx={{ mt: 3 }}>
        Already have an account?
        <Link to="/login">Please Login</Link>
      </Typography>
      {showOtp && (<Otp email={email} password={password} mobileNumber={mobileNumber} />)}

    </Box>
  );
};

export default Signup;
