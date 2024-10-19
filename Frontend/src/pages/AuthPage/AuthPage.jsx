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
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({}); // Error state as an object to track multiple field errors
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    // Validate passwords when registering
    if (!isLogin && password !== confirmPassword) {
      setError({ confirmPassword: 'Passwords do not match.' });
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
        navigate('/dashboard/board');
      } else {
        // Register logic
        const res = await axios.post('http://localhost:5000/api/users/register', {
          name,
          email,
          password,
        });
        setIsLogin(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Show error under email input for user already exists, otherwise show general error
        if (error.response.data.message === 'User already exists') {
          setError({ email: error.response.data.message });
        } else {
          setError({ general: error.response.data.message || 'Something went wrong.' });
        }
      } else {
        setError({ general: 'Request failed. Please try again later.' });
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-welcome">
          <img src={Form} alt="Form Illustration" />
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
              {error.name && <p className="input-error">{error.name}</p>}
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
            {error.email && <p className="input-error">{error.email}</p>}
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
            {error.password && <p className="input-error">{error.password}</p>}
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
              {error.confirmPassword && <p className="input-error">{error.confirmPassword}</p>}
            </div>
          )}
          <button type="submit" className="btn-auth">
            {isLogin ? 'Log in' : 'Register'}
          </button>

          {error.general && <p className="inpt-error">{error.general}</p>}

          <p className="toggle-link">
            {isLogin ? "Don't have an account?" : 'Have an account?'}
          </p>

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
