import React, { useState } from 'react';
import './AuthPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from '../../assets/Form.png';
import Profile from '../../assets/Profile.png';
import Mail from '../../assets/mail.png';
import Lock from '../../assets/lock.png';
import View from '../../assets/view.png';
import Hide from '../../assets/hide.png';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle state for login/register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and register
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        const res = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password,
        });
        localStorage.setItem('auth-token', res.data.token);
        alert('Login successful');
        navigate('/dashboard'); // Redirect to dashboard using useNavigate
      } else {
        // Register logic
        const res = await axios.post('http://localhost:5000/api/users/register', {
          name,
          email,
          password,
        });
        alert('Registration successful');
        setIsLogin(true); // Switch to login after registration
      }
    } catch (error) {
      alert(error.response.data.message || 'Request failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-welcome">
          <img src={Form} alt="" />
          <h2>Welcome aboard my friend</h2>
          <p>Just a couple of clicks and we start</p>
        </div>
      </div>
      <div className="auth-right">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group icon-input">
              <img src={Profile} alt="Profile Icon" className="input-icon" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group icon-input">
            <img src={Mail} alt="Mail Icon" className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group icon-input">
            <img src={Lock} alt="Lock Icon" className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={showPassword ? Hide : View}
              alt="Toggle Password Visibility"
              className="toggle-password-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          {!isLogin && (
            <div className="form-group icon-input">
              <img src={Lock} alt="Lock Icon" className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img
                src={showConfirmPassword ? Hide : View}
                alt="Toggle Confirm Password Visibility"
                className="toggle-password-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          )}
          <button type="submit" className="btn-auth">
            {isLogin ? 'Log in' : 'Register'}
          </button>

          {/* Keep the toggle text */}
          <p className="toggle-link">
            {isLogin ? "Don't have an account?" : 'Have an account?'}{' '}
          </p>

          {/* Add a button to toggle between Login and Register */}
          <button
            type="button"
            className="btn-auth toggle-btn"
            onClick={toggleForm}
          >
            {isLogin ? 'Register' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
