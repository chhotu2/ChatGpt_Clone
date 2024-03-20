import React from 'react'
import { Box, Typography, useTheme, useMediaQuery, TextField, Button, Alert, Collapse } from '@mui/material'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
 


const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isNotMobile = useMediaQuery("(min-width: 1000px)")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState('')

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/auth/login', { email, password });
      console.log("Response->",data.token)

      if(data.token){
        localStorage.setItem("authToken", data.token);
      }
      toast.success("Login Successfully");
      navigate("/")
    }
    catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(" Invalid Crediantial");
      if (error.response.data.error) {
        setError(error.response.data.error);
      }

    }
    setTimeout(() => {
      setError("");
    }, 5000);
  }
  return (


    <Box width={isNotMobile ? '40%' : '80%'} p={'2rem'} m={'2rem auto'}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      backgroundColor={theme.palette.background.alt}
    >

      <form onSubmit={handleOnSubmit}>
        <Typography variant='h3'> Login</Typography>
        <TextField
          label="email"
          required
          margin='normal'
          fullWidth
          value={email}
          onChange={(e) => { setEmail(e.target.value) }} />


        <TextField
          label="password"
          type='password'
          required
          margin='normal'
          fullWidth
          value={password}
          onChange={(e) => { setPassword(e.target.value) }} />
        <Button type='submit' fullWidth variant='contained' size='large' sx={{ color: 'white', mt: 2 }} >Login</Button>
      </form>


      <Typography sx={{ mt: 3 }}>

        <Link to="/ForgetPassword">Forget Password?</Link>
      </Typography>

    </Box>
  )
}

export default Login
