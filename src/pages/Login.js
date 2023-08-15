// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendKeytoBackend, fetchUser } from '../api'; // Import your API functions
import { Button, FormControl, InputLabel, Input } from '@mui/material';
function Login() {
  const [apiKey, setApiKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // ... Rest of the component ...

  const handleLogin = async () => {
    try {
      const response = await sendKeytoBackend(apiKey);
      const token = response.token;
      
      localStorage.setItem('token', token);
      setIsLoggedIn(true);

      const fetchedUsername = await fetchUser(token);
      console.log(fetchedUsername)
      setUsername(fetchedUsername);

      localStorage.setItem('username', fetchedUsername);

      navigate('/Crimes');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsLoggedIn(false);

    navigate('/');
  };

  return (
    <div className="container">
      {isLoggedIn ? (
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <FormControl sx={{ padding: '16px' }}>
          <h1>Login</h1>
          <InputLabel htmlFor="apiKey">API Key</InputLabel>
          <Input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            sx={{
              marginTop: '8px',
              marginBottom: '8px',
              backgroundColor: 'white', // Set a white background color
              color: 'black', // Set a black text color
            }}
          />
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Login
          </Button>
        </FormControl>
      )}
    </div>
  );
}

export default Login;
