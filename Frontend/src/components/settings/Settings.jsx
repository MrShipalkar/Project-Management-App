import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Settings.css';
import View from '../../assets/view.png';
import Hide from '../../assets/hide.png';
import Profile from '../../assets/Profile.png';
import Mail from '../../assets/mail.png';
import Lock from '../../assets/lock.png';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Fetch the user data on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('auth-token'); // Get token from localStorage
  
        if (!token) {
          throw new Error('No token available');
        }
  
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'auth-token': token,  // Attach the token to the headers
          },
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
        console.error('Error fetching user details:', error);
      }
    };
  
    fetchUserDetails();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const updates = {};

    // Check which fields have been modified, and only include those in the updates object
    if (userInfo.name !== originalUserInfo.name) {
      updates.name = userInfo.name;
    }
    if (userInfo.email !== originalUserInfo.email) {
      updates.email = userInfo.email;
    }
    if (userInfo.oldPassword && userInfo.newPassword) {
      updates.oldPassword = userInfo.oldPassword;
      updates.newPassword = userInfo.newPassword;
    }

    // If no fields were modified, return early
    if (Object.keys(updates).length === 0) {
      setError('No changes detected.');
      return;
    }

    try {
      const token = localStorage.getItem('auth-token');

      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      // Make an API request to update the user's profile
      const res = await axios.put(
        'http://localhost:5000/api/users/update',
        updates,
        {
          headers: {
            'auth-token': token, // Use 'auth-token' in the headers
          },
        }
      );

      // If the email or password is updated, log the user out and redirect them to the home page
      if (updates.email || (updates.oldPassword && updates.newPassword)) {
        localStorage.removeItem('auth-token'); // Remove token
        setSuccess('Profile updated successfully! You will be logged out.');
        
        // Redirect to the homepage after a short delay
        setTimeout(() => {
          navigate('/'); // Redirect to the home page
        }, 1500); // Redirect after 1.5 seconds
      } else {
        setSuccess('Profile updated successfully!');
      }
      
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Something went wrong.');
      } else {
        setError('Network error. Please try again.');
      }
    }
  };

  return (
    <div className="settings-form-container">
      <h2>Settings</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <img src={Profile} alt="Profile Icon" className="input-icon" />
          <input
            type="text"
            name="name"
            value={userInfo.name} // Pre-filled with fetched name
            onChange={handleInputChange}
            placeholder="Name"
          />
        </div>

        <div className="form-group">
          <img src={Mail} alt="Mail Icon" className="input-icon" />
          <input
            type="email"
            name="email"
            value={userInfo.email} // Pre-filled with fetched email
            onChange={handleInputChange}
            placeholder="Update Email"
          />
        </div>

        <div className="form-group">
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

        <div className="form-group">
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
