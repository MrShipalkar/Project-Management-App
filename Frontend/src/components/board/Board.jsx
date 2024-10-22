import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For making API requests
import AddTaskModal from '../addTaskModal/addTaskModal'; // Importing the modal
import './Board.css';
import Collapse from '../../assets/collapse.png';
import Add from '../../assets/add.png';
import Addpeople from '../../assets/Addpeople.png';
import Dropdown from '../../assets/down.png';

const Board = () => {
  const [userName, setUserName] = useState(''); // State to store the user's name
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const [selectedOption, setSelectedOption] = useState('This week'); // Default value for the dropdown
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false); // Manage modal open state

  // Fetch user's name on component mount
  useEffect(() => {
    const fetchUserName = async () => {
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

        setUserName(res.data.name); // Update the state with the fetched user name
      } catch (error) {
        setError('Error fetching user details');
      }
    };

    fetchUserName();
  }, []); // Empty dependency array ensures the effect runs only once on component mount

  // Helper function to get ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // Covers 11th to 19th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  // Get current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('en-US', { month: 'short' }); // 'Jan'
  const year = currentDate.getFullYear();
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle selecting an option from the dropdown
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false); // Close the dropdown after selecting
  };

  return (
    <div className="board-container">
      <header className="board-header">
        <div>
          <h2>Welcome! {userName || 'User'} </h2> {/* Fallback to 'User' if the name is not yet available */}
        </div>
        <div>
          <p>{formattedDate}</p>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>} {/* Display error if there's an issue fetching user details */}

      <div className="board-title">
        <div className="board-title-name">
          <h3>Board</h3>
          <div className="add-people-btn">
            <img src={Addpeople} alt="Add People" /> Add People
          </div>
        </div>
        <div className="dropdown-container">
          <p className="this-week" onClick={toggleDropdown}>
            {selectedOption} <span><img src={Dropdown} alt="Dropdown Icon" /></span>
          </p>
          {isDropdownOpen && (
            <ul className="dropdown">
              <li onClick={() => handleSelectOption('Today')}>Today</li>
              <li onClick={() => handleSelectOption('This Week')}>This Week</li>
              <li onClick={() => handleSelectOption('This Month')}>This Month</li>
            </ul>
          )}
        </div>
      </div>

      <div className="board-columns">
        <div className="board-column">
          <div className="column-header">
            <h3>Backlog</h3>
            <button className="icon-btn">
              <img src={Collapse} alt="Collapse" />
            </button>
          </div>
        </div>

        <div className="board-column">
          <div className="column-header">
            <h3>To do</h3>
            <div>
              <button className="add-task-btn" onClick={() => setIsAddTaskModalOpen(true)}>
                <img src={Add} alt="Add Task" />
              </button>
              <button className="icon-btn">
                <img src={Collapse} alt="Collapse" />
              </button>
            </div>
          </div>
        </div>

        <div className="board-column">
          <div className="column-header">
            <h3>In progress</h3>
            <button className="icon-btn">
              <img src={Collapse} alt="Collapse" />
            </button>
          </div>
        </div>

        <div className="board-column">
          <div className="column-header">
            <h3>Done</h3>
            <button className="icon-btn">
              <img src={Collapse} alt="Collapse" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)} // Close modal
      />
    </div>
  );
};

export default Board;
