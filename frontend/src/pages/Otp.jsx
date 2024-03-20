import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { Box, Typography, useTheme, useMediaQuery, Button, Alert } from '@mui/material'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Otp({ email, password, mobileNumber }) {
    const [otp, setOtp] = useState('');
    const [motp, setmotp] = useState('')
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isNotMobile = useMediaQuery("(min-width: 1000px)")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("email->", email)
        console.log("email->", mobileNumber)
        console.log("email->", password)

        try {
            setLoading(true);
            const response = await axios.post('/api/v1/auth/signup', { email, password, mobileNumber, otp });
            console.log(response)
            // Redirect to login page or some other page
            navigate('/login');
        } catch (error) {
            setLoading(false);
            setError('Failed to create account. Please try again.');
            console.error(error);
        }
    }



    return (
        <div>
            <Box width={isNotMobile ? '20%' : '80%'} p={'2rem'} m={'2rem auto'}
                borderRadius={5}
                sx={{ boxShadow: 5 }}
                backgroundColor={theme.palette.background.alt}
            >
                <form onSubmit={handleSubmit}>
                    <label>Enter Email Verification OTP</label>
                    <OtpInput
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        inputStyle={{ width: '100%', height: '2rem', marginBottom: "2rem", marginTop: "1rem" }}
                        renderInput={(props) => <input {...props} />}
                        value={otp}
                        onChange={(otp) => { setOtp(otp) }}
                    />


                    <label>Enter Mobile Verification OTP</label>
                    <OtpInput
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        inputStyle={{ width: '100%', height: '2rem', marginBottom: "2rem", marginTop: "1rem" }}
                        renderInput={(props) => <input {...props} />}
                        value={motp}
                        onChange={(otp) => { setmotp(otp) }}
                    />


                    {error && <Alert severity="error">{error}</Alert>}
                    <Button type='submit' fullWidth variant='contained' size='large' sx={{ color: 'white', mt: 2 }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
            </Box>
        </div>
    );
}