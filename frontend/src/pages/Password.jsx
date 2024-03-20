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
    const [confirmpassword, setconfirmPassword] = useState("")


    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmpassword) {
                toast.error("Password and Confirm Password Should be Same");
                return;
            }

            const token = localStorage.getItem('PasswordResetToken');


            const { data } = await axios.post('/api/v1/auth/reset-password', { token, password, confirmpassword });
            console.log("Response->", data.token)


            toast.success("Password Update Successfully");


            localStorage.removeItem('PasswordResetToken')

            navigate("/")
        }
        catch (error) {

            console.log(error);
            toast.error(" Invalid Crediantial");
            if (error.response.data.error) {
                toast.error(error.response.data.error);
            }

        }
        // setTimeout(() => {
        //     setError("");
        // }, 5000);
    }
    return (


        <Box width={isNotMobile ? '40%' : '80%'} p={'2rem'} m={'2rem auto'}
            borderRadius={5}
            sx={{ boxShadow: 5 }}
            backgroundColor={theme.palette.background.alt}
        >

            <form onSubmit={handleOnSubmit}>
                <Typography variant='h3'>Password Reset</Typography>



                <TextField
                    label="password"
                    type='password'
                    required
                    margin='normal'
                    fullWidth
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }} />

                <TextField
                    label="confirmpassword"
                    type='confirmpassword'
                    required
                    margin='normal'
                    fullWidth
                    value={confirmpassword}
                    onChange={(e) => { setconfirmPassword(e.target.value) }} />

                <Button type='submit' fullWidth variant='contained' size='large' sx={{ color: 'white', mt: 2 }} >Login</Button>
            </form>




        </Box>
    )
}

export default Login
