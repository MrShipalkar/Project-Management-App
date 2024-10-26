import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Settings.css';
import View from '../../assets/view.png';
import Hide from '../../assets/hide.png';
import Profile from '../../assets/Profile.png';
import Mail from '../../assets/mail.png';
import Lock from '../../assets/lock.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_URL from '../../services/config'

const Settings = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  const [originalUserInfo, setOriginalUserInfo] = useState({
    name: '',
    email: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('auth-token');

        if (!token) throw new Error('No token available');

        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { 'auth-token': token },
        });

        setUserInfo({
          name: res.data.name,
          email: res.data.email,
          oldPassword: '',
          newPassword: '',
        });

        setOriginalUserInfo({
          name: res.data.name,
          email: res.data.email,
        });
      } catch (error) {
        toast.error('Error fetching user details.');
        console.error(error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updates = {};

    if (userInfo.name !== originalUserInfo.name) updates.name = userInfo.name;
    if (userInfo.email !== originalUserInfo.email) updates.email = userInfo.email;
    if (userInfo.oldPassword && userInfo.newPassword) {
      updates.oldPassword = userInfo.oldPassword;
      updates.newPassword = userInfo.newPassword;
    }

    if (Object.keys(updates).length === 0) {
      toast.error('No changes detected.');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');

      if (!token) {
        toast.error('No token found. Please log in again.');
        return;
      }

      const res = await axios.put(
        `${API_URL}/api/users/update`,
        updates,
        {
          headers: { 'auth-token': token },
        }
      );

      if (updates.email || (updates.oldPassword && updates.newPassword)) {
        localStorage.removeItem('auth-token');
        toast.success('Profile updated successfully! You will be logged out.');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.success('Profile updated successfully!');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong.';
      toast.error(errorMsg);
      console.error(err);
    }
  };

  return (
    <div className="settings-form-container">
      <h2>Settings</h2>

      <form onSubmit={handleSubmit}>
        <div className="setting-form-group">
          <img src={Profile} alt="Profile Icon" className="input-icon" />
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
        </div>

        <div className="setting-form-group">
          <img src={Mail} alt="Mail Icon" className="input-icon" />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleInputChange}
            placeholder="Update Email"
          />
        </div>

        <div className="setting-form-group">
          <div className="password-wrapper">
            <img src={Lock} alt="Lock Icon" className="input-icon" />
            <input
              type={showOldPassword ? 'text' : 'password'}
              name="oldPassword"
              value={userInfo.oldPassword}
              onChange={handleInputChange}
              placeholder="Old Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? <img src={Hide} alt="Hide" /> : <img src={View} alt="View" />}
            </span>
          </div>
        </div>

        <div className="setting-form-group">
          <div className="password-wrapper">
            <img src={Lock} alt="Lock Icon" className="input-icon" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={userInfo.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <img src={Hide} alt="Hide" /> : <img src={View} alt="View" />}
            </span>
          </div>
        </div>

        <button type="submit" className="update-btn">Update</button>
      </form>
    </div>
  );
};

export default Settings;
