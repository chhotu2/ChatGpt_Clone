import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Box, Typography, useTheme, useMediaQuery, TextField, Button, Alert, Collapse } from '@mui/material'
import { Password } from '@mui/icons-material';
import { Navigate, useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();


  const isNotMobile = useMediaQuery("(min-width: 1000px)")

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    console.log(email)
    try {
      const { data } = await axios.post('api/v1/auth/forgetPassword', { email })
      if(data.token){
        localStorage.setItem("PasswordResetToken",data.token);
      }

      console.log("Data Token->", data.token)
      toast.success("A password reset link is sent to mail");
      // navigate('/password-reset');
    }
    catch (error) {
      console.log(error);
      toast.error("Problem in sending password reset link to the email")
    }
  }
  return (
    <div>
      <h1>Forget Password Page</h1>
      <Box width={isNotMobile ? '40%' : '80%'} p={'2rem'} m={'2rem auto'}
        borderRadius={5}
        sx={{ boxShadow: 5 }}
        backgroundColor={theme.palette.background.alt}
      >

        <form onSubmit={handleOnSubmit}>
          <Typography variant='h3'> Emter your email</Typography>
          <TextField
            label="email"
            required
            margin='normal'
            fullWidth
            value={email}
            onChange={(e) => { setEmail(e.target.value) }} />


          <Button type='submit' fullWidth variant='contained' size='large' sx={{ color: 'white', mt: 2 }} >Reset Password</Button>



        </form>




      </Box>
    </div>
  )
}

export default ForgetPassword
