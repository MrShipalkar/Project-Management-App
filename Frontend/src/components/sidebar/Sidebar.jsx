import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import Logo from '../../assets/Logo.png'
import Board from '../../assets/board.png'
import Analytics from '../../assets/analytics.png'
import Settings from '../../assets/settings.png'


const Sidebar = () => {
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
              <span className="sidebar-icon"><img src={Board} alt="" /></span>
              Board
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/analytics"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon"><img src={Analytics} alt="" /></span>
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <span className="sidebar-icon"><img src={Settings} alt="" /></span>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="logout-section">
        <NavLink to="/logout" className="logout-link">
          <span className="sidebar-icon">🔴</span>
          Log out
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
