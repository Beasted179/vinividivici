import React, { useEffect, useState } from 'react';
import WebSocketComponent from '../components/WebSocketComponent'; // Import your WebSocket component

const Crimes = () => {
  // Retrieve the username from localStorage
  const username = localStorage.getItem('username');

  return (
    <div className="container">
      <h1>Crimes</h1>
      {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <p>Welcome to the Crimes page!</p>
      )}

      <WebSocketComponent />
    </div>
  );
};

export default Crimes;


