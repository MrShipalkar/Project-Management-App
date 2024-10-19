import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Board from '../../components/board/Board';
import Analytics from '../../components/analytics/analytics';
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
          {/* Default route, redirects to board */}
          <Route path="/" element={<Board />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
