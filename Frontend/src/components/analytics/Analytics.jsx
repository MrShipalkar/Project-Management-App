import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css'; // Import the CSS file for styling

const Analytics = () => {
  const [taskData, setTaskData] = useState({
    backlog: 0,
    toDo: 0,
    inProgress: 0,
    completed: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
    dueDate: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('auth-token'); // Assuming token is stored in localStorage
        const res = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            'auth-token': token,
          },
        });
        const tasks = res.data;

        // Count tasks based on their status and priority
        const counts = {
          backlog: tasks.filter((task) => task.status === 'backlog').length,
          toDo: tasks.filter((task) => task.status === 'to-do').length,
          inProgress: tasks.filter((task) => task.status === 'in-progress').length,
          completed: tasks.filter((task) => task.status === 'done').length,
          lowPriority: tasks.filter((task) => task.priority === 'Low').length,
          moderatePriority: tasks.filter((task) => task.priority === 'Moderate').length,
          highPriority: tasks.filter((task) => task.priority === 'High').length,
          dueDate: tasks.filter((task) => task.dueDate).length, // Count tasks that have a dueDate
        };

        // Update state with calculated counts
        setTaskData(counts);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks.');
      }
    };

    fetchTasks();
  }, []); // Run once when the component mounts

  return (
    <div className="analytics-container">
      <h3 className="analytics-header">Analytics</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="analytics-cards">
          <div className="card">
            <ul>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>Backlog Tasks</span>
                  <span className="task-count">{taskData.backlog}</span>
                </div>
              </li>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>To-do Tasks</span>
                  <span className="task-count">{taskData.toDo}</span>
                </div>
              </li>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                In-Progress Tasks
                <span className="task-count">{taskData.inProgress}</span>
                  </div>
              </li>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>Completed Tasks</span>
                  <span className="task-count">{taskData.completed}</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="card">
            <ul>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>Low Priority</span>
                  <span className="task-count">{taskData.lowPriority}</span>
                </div>
              </li>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>Moderate Priority</span>
                  <span className="task-count">{taskData.moderatePriority}</span>
                </div>
              </li>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>High Priority</span>
                  <span className="task-count">{taskData.highPriority}</span>
                </div>
              </li>
              <li>
                <span className="bullet"></span>
                <div className='task-category'>
                  <span>Due Date Tasks</span>
                <span className="task-count">{taskData.dueDate}</span>
                </div>
               
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
