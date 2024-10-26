import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Board from '../../components/board/Board';
import Analytics from '../../components/analytics/Analytics';
import Settings from '../../components/settings/Settings';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <Routes>
          <Route path="board" element={<Board />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/" element={<Board />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
