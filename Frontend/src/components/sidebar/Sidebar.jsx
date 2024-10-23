import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import './Sidebar.css';
import Logo from '../../assets/Logo.png';
import Board from '../../assets/board.png';
import Analytics from '../../assets/analytics.png';
import Settings from '../../assets/settings.png';
import Logout from '../../assets/Logout.png';
import LogoutConfirmationModal from '../logoutModal/LogoutModal'; // Import the logout modal

const Sidebar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State to control logout modal
  const navigate = useNavigate(); 

  // Function to handle actual logout
  const handleConfirmLogout = () => {
    localStorage.removeItem('auth-token'); 
    localStorage.removeItem('user-name');
    setIsLogoutModalOpen(false); // Close the modal
    navigate('/'); 
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
        <div className="logout-link" onClick={() => setIsLogoutModalOpen(true)}>
          <span className="sidebar-icon">
            <img src={Logout} alt="Logout Icon" />
          </span>
          Log out
        </div>
      </div>

      {/* Render Logout Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default Sidebar;
