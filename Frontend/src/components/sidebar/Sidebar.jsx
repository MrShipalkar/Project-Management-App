import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Sidebar.css';
import Logo from '../../assets/Logo.png';
import Board from '../../assets/board.png';
import Analytics from '../../assets/analytics.png';
import Settings from '../../assets/settings.png';
import Logout from '../../assets/Logout.png';


const Sidebar = () => {
  const navigate = useNavigate(); // Create the navigate function

  // Logout handler to remove the token and redirect to home
  const handleLogout = () => {
    localStorage.removeItem('auth-token'); // Remove token from localStorage
    localStorage.removeItem('user-name');
    navigate('/'); // Redirect to the home page
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={Logo} alt="" />
        <h3>Pro Manage</h3>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/dashboard/board"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">
                <img src={Board} alt="Board Icon" />
              </span>
              Board
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">
                <img src={Analytics} alt="Analytics Icon" />
              </span>
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon">
                <img src={Settings} alt="Settings Icon" />
              </span>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="logout-section">
        {/* Use onClick for handling the logout functionality */}
        <div className="logout-link" onClick={handleLogout}>
          <span className="sidebar-icon">
            <img src={Logout} alt="Logout Icon" />
          </span>
          Log out
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
