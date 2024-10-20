import React, { useState } from 'react';
import './Board.css';
import Collapse from '../../assets/collapse.png';
import Add from '../../assets/add.png';
import Addpeople from '../../assets/Addpeople.png';
import Dropdown from '../../assets/down.png';

const Board = () => {
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

  const userName = localStorage.getItem('user-name') || 'User';

  // Get current date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('en-US', { month: 'short' }); // 'Jan'
  const year = currentDate.getFullYear();
  const formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;

  // State to manage dropdown and selected option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('This week'); // Default value

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
          <h2>Welcome! {userName} </h2>
        </div>
        <div>
          {/* Render the current date here in the correct format */}
          <p>{formattedDate}</p>
        </div>
      </header>

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

      {/* Board columns */}
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
              <button className="add-task-btn">
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
    </div>
  );
};

export default Board;
