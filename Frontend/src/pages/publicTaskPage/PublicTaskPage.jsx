import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PublicTaskPage.css';
import Logo from '../../assets/logo.png'; 
import API_URL from '../../services/config'


const PublicTaskPage = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/tasks/task/${taskId}`);
                setTask(response.data);
            } catch (error) {
                setErrorMessage('Failed to load task. Please try again later.');
            }
        };

        fetchTask();
    }, [taskId]);

    
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

   
    const getDueDateClass = (status, dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);

        
        if (status === 'done') {
            return 'due-date-green';
        }
        
        
        if (due < now) {
            return 'due-date-red';
        }

        
        return 'due-date-gray';
    };

    
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
                      
                        <div className={`task-priority ${getPriorityClass(task.priority)}`}>
                            <span className={`priority-bullet ${getPriorityClass(task.priority)}`}></span>
                            {task.priority.toUpperCase()} PRIORITY
                        </div>

                        <h2 className="task-title">{task.title}</h2>

                        
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
