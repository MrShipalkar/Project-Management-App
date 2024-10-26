import React, { useState } from 'react';
import './AuthPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});

    if (!isLogin && password !== confirmPassword) {
      setError({ confirmPassword: 'Passwords do not match.' });
      return;
    }

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/users/login', {
          email,
          password,
        });

        const { token, user } = res.data;
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user-name', user.username);

        toast.success('Login successful!');

        setTimeout(() => navigate('/dashboard/board'), 1500); // Navigate after a slight delay
      } else {
        await axios.post('http://localhost:5000/api/users/register', {
          name,
          email,
          password,
        });
        setIsLogin(true);
        toast.success('Registration successful! Please log in.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
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
      <ToastContainer />
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
              <p className={`input-error ${error.name ? 'visible' : ''}`}>{error.name || ''}</p>
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
            <p className={`input-error ${error.email ? 'visible' : ''}`}>{error.email || ''}</p>
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
            <p className={`input-error ${error.password ? 'visible' : ''}`}>{error.password || ''}</p>
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
              <p className={`input-error ${error.confirmPassword ? 'visible' : ''}`}>{error.confirmPassword || ''}</p>
            </div>
          )}
          <button type="submit" className="btn-auth">
            {isLogin ? 'Log in' : 'Register'}
          </button>

          {/* General Error Message */}
          <p className={`general-error ${error.general ? 'visible' : ''}`}>{error.general || ''}</p>

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
