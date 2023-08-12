import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../pages/Login'; // Import your Login component

function NavBar() {
  return (
    <nav className="nav">
      <Link to="/" className="nav-title">ViniVidiVici</Link>
      <ul>
        <li>
          <Link to="/Crimes">Crimes</Link>
        </li>
      </ul>
      <Login /> {/* Render the Login component */}
    </nav>
  );
}

export default NavBar;

