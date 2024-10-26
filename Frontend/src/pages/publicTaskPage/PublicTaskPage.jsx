import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PublicTaskPage.css';
import Logo from '../../assets/logo.png';  // Add the correct path to your logo image

const PublicTaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/tasks/task/${taskId}`);
                setTask(response.data);
            } catch (error) {
                setErrorMessage('Failed to load task. Please try again later.');
            }
        };

        fetchTask();
    }, [taskId]);

    // Format the due date
    const formatDueDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const options = { month: 'short', day: 'numeric' };
        const day = date.getDate();
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                       day % 10 === 2 && day !== 12 ? 'nd' :
                       day % 10 === 3 && day !== 13 ? 'rd' : 'th';
        return `${date.toLocaleDateString('en-US', options)}${suffix}`;
    };

    // Determine the due date button class based on the status and due date
    const getDueDateClass = (status, dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);

        // If task is done, return green class
        if (status === 'done') {
            return 'due-date-green';
        }
        
        // If the task is not done and past the due date, return red class
        if (due < now) {
            return 'due-date-red';
        }

        // If the task is not done and the due date is upcoming, return gray class
        return 'due-date-gray';
    };

    // Get priority class (high, moderate, low)
    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High':
                return 'high-priority';
            case 'Moderate':
                return 'moderate-priority';
            case 'Low':
                return 'low-priority';
            default:
                return '';
        }
    };

    return (
        <div className="full-page-container">
            <div className="logo-section">
                <img src={Logo} alt="Logo" className="logo" />
                Pro Manage
            </div>
            <div className="public-task-page">
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {task ? (
                    <div className="task-details">
                        {/* Priority section */}
                        <div className={`task-priority ${getPriorityClass(task.priority)}`}>
                            <span className={`priority-bullet ${getPriorityClass(task.priority)}`}></span>
                            {task.priority.toUpperCase()} PRIORITY
                        </div>

                        <h2 className="task-title">{task.title}</h2>

                        {/* Checklist Count */}
                        <div className="checklist-count">
                            Checklist ({task.checklist.filter(item => item.checked).length}/{task.checklist.length})
                        </div>

                        <div className="checklist-section">
                            <ul className="checklist">
                                {task.checklist.map((item, index) => (
                                    <li key={index}>
                                        <input type="checkbox" checked={item.checked} readOnly />
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {task.dueDate && (
                            <div className="due-date">
                                <span>Due Date</span>
                                <button className={`public-date-btn ${getDueDateClass(task.status, task.dueDate)}`}>
                                    {formatDueDate(task.dueDate)}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading task details...</p>
                )}
            </div>
        </div>
    );
};

export default PublicTaskPage;