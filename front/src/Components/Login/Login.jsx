import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../services/UserService';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const handleLogin = async () => {

    console.log('Email:', email);
    console.log('Password:', password);
    try{
      const response = await loginUser({ email, password });
      console.log('Response:', response);
      localStorage.setItem('token', response.access_token);
      window.location.reload();

    }catch(error){
      window.alert(error);
    }

  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            margin="normal"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleLogin} sx={{ marginTop: 2 }}>
            Login
          </Button>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            No account?{' '}
            <Link component={RouterLink} to="/register">
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
