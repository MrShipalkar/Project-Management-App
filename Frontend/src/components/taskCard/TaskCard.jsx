import React, { useState, useEffect } from 'react';
import './TaskCard.css'; // Importing CSS
import More from '../../assets/more.png'; // Assuming this is the image for the 'more' button
import DropdownIcon from '../../assets/dropdown.png'; // Add dropdown arrow icon
import axios from 'axios'; // Import axios for API requests

const TaskCard = ({ priority, title, checklist, column, taskId, onStatusChange, dueDate, isCollapsed }) => {
    const [isChecklistOpen, setIsChecklistOpen] = useState(false); // State for toggling checklist dropdown

    // Collapse checklist if the column's collapse state is true
    useEffect(() => {
        if (isCollapsed) {
            setIsChecklistOpen(false);
        }
    }, [isCollapsed]);

    // Function to format the due date
    const formatDueDate = (dateStr) => {
        if (!dateStr) return ''; // If no date is provided
        const date = new Date(dateStr);
        const options = { month: 'short', day: 'numeric' }; // Short month and day
        const day = date.getDate();
        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                       day % 10 === 2 && day !== 12 ? 'nd' :
                       day % 10 === 3 && day !== 13 ? 'rd' : 'th'; // Add suffix to day
        return `${date.toLocaleDateString('en-US', options)}${suffix}`; // Format: "Dec 20th"
    };

    const getPriorityClass = () => {
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

    const toggleChecklist = () => {
        setIsChecklistOpen(!isChecklistOpen); // Toggle the checklist
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('auth-token'); // Get the auth token
            const res = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
                headers: {
                    'auth-token': token,
                },
            });

            // Notify the parent component (Board) about the status change
            onStatusChange(res.data);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const isOverdue = dueDate && new Date(dueDate) < new Date(); // Check if task is overdue

    // Add CSS classes based on task status and due date
    const getDueDateClass = () => {
        if (column === 'done') {
            return 'due-date-green'; // Green for done tasks
        } else if (isOverdue) {
            return 'due-date-red'; // Red for overdue tasks
        }
        return 'due-date-gray'; // Gray for active tasks
    };

    // Check if checklist is defined and has items to prevent map errors
    const checklistItems = checklist || [];

    return (
        <div className="task-card">
            <div className='task-header-sec'>
                <div className={`task-priority ${getPriorityClass()}`}>
                    <span className={`priority-bullet ${getPriorityClass()}`}></span>
                    {priority.toUpperCase()} PRIORITY
                </div>
                <img src={More} alt="More options" />
            </div>

            <h4 className="task-title">{title}</h4>

            <div className="task-checklist" onClick={toggleChecklist}>
                Checklist ({checklistItems.filter(item => item.checked).length}/{checklistItems.length})
                <img src={DropdownIcon} alt="Toggle" className={`dropdown-arrow ${isChecklistOpen ? 'open' : ''}`} />
            </div>

            {/* Conditionally render the checklist tasks */}
            {isChecklistOpen && (
                <div className="checklist-items">
                    {checklistItems.length > 0 ? (
                        checklistItems.map((item, index) => (
                            <div key={index} className="checklist-task">
                                <input type="checkbox" checked={item.checked} readOnly />
                                <span className={item.checked ? 'checked' : ''}>{item.text}</span>
                            </div>
                        ))
                    ) : (
                        <div>No tasks in the checklist</div>
                    )}
                </div>
            )}

            <div className='card-footer'>
                <div className="task-date">
                    {dueDate && <button className={`date-btn ${getDueDateClass()}`}>{formatDueDate(dueDate)}</button>} {/* Hide if no due date */}
                </div>

                {/* Conditionally render task status buttons based on the current column */}
                <div className="task-status">
                    {column !== 'backlog' && <button className="task-status-btn" onClick={() => handleStatusChange('backlog')}>BACKLOG</button>}
                    {column !== 'progress' && <button className="task-status-btn" onClick={() => handleStatusChange('in-progress')}>PROGRESS</button>}
                    {column !== 'to-do' && <button className="task-status-btn" onClick={() => handleStatusChange('to-do')}>TO-DO</button>}
                    {column !== 'done' && <button className="task-status-btn" onClick={() => handleStatusChange('done')}>DONE</button>}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
