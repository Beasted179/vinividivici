// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendKeytoBackend, fetchUser } from '../api'; // Import your API functions

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
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <h1>Login</h1>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API Key"
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
}

export default Login;
