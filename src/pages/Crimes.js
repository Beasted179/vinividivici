import React from 'react';

const Crimes = () => {
  // Retrieve the username from localStorage
  const username = localStorage.getItem('username');
console.log(username)
  return (
    <div className="container">
      <h1>Crimes</h1>
      {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <p>Welcome to the Crimes page!</p>
      )}
    </div>
  );
};

export default Crimes;


