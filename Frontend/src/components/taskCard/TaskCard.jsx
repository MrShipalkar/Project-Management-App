import React, { useState, useEffect } from 'react';
import './TaskCard.css';
import More from '../../assets/more.png';
import DropdownIcon from '../../assets/dropdown.png';
import axios from 'axios';
import DeleteConfirmationModal from '../deleteModal/DeleteModal';
import EditTaskModal from '../editTaskModal/EditTaskModal';

const TaskCard = ({ priority, title, checklist, column, taskId, onStatusChange, dueDate, isChecklistOpen, onToggleChecklist, onDeleteTask, assignedTo }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [assignedUserInitials, setAssignedUserInitials] = useState(null);

    useEffect(() => {
        if (assignedTo && typeof assignedTo === 'string') {
            // Check if assignedTo is a string and split it to get initials
            const initials = assignedTo.split(' ').map(word => word[0]).join('').toUpperCase();
            setAssignedUserInitials(initials);
        } else if (assignedTo && typeof assignedTo === 'object' && assignedTo.name) {
            // If assignedTo is an object with a name property, extract initials from name
            const initials = assignedTo.name.split(' ').map(word => word[0]).join('').toUpperCase();
            setAssignedUserInitials(initials);
        }
    }, [assignedTo]);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleEdit = () => {
        setIsEditModalOpen(true);
        setIsDropdownOpen(false);
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, {
                headers: { 'auth-token': token },
            });
            onStatusChange(res.data);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { 'auth-token': token },
            });
            onDeleteTask(taskId);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

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

    const getPriorityClass = () => {
        switch (priority) {
            case 'High': return 'high-priority';
            case 'Moderate': return 'moderate-priority';
            case 'Low': return 'low-priority';
            default: return '';
        }
    };

    const getDueDateClass = () => {
        const isOverdue = dueDate && new Date(dueDate) < new Date();
        if (column === 'done') return 'due-date-green';
        return isOverdue ? 'due-date-red' : 'due-date-gray';
    };

    return (
        <div className="task-card">
            <div className='task-header-sec'>
                <div className={`task-priority ${getPriorityClass()}`}>
                    <span className={`priority-bullet ${getPriorityClass()}`}></span>
                    {priority.toUpperCase()} PRIORITY

                    {/* Display Avatar with Assigned User's Initials */}
                    {assignedUserInitials && (
                        <span className="assigned-avatar">
                            {assignedUserInitials}
                        </span>
                    )}
                </div>
                <div className="more-options">
                    <img src={More} alt="More options" onClick={toggleDropdown} />
                    {isDropdownOpen && (
                        <ul className="dropdown-options">
                            <li onClick={handleEdit}>Edit</li>
                            <li onClick={() => setShareMessage('Link copied to clipboard!')}>Share</li>
                            <li onClick={() => { setIsDeleteModalOpen(true); setIsDropdownOpen(false); }}>Delete</li>
                        </ul>
                    )}
                </div>
            </div>

            <h4 className="task-title" title={title}>
                {title}
            </h4>

            <div className="task-checklist" onClick={onToggleChecklist}>
                Checklist ({checklist.filter(item => item.checked).length}/{checklist.length})
                <img src={DropdownIcon} alt="Toggle" className={`dropdown-arrow ${isChecklistOpen ? 'open' : ''}`} />
            </div>

            {isChecklistOpen && (
                <div className="checklist-items">
                    {checklist.map((item, index) => (
                        <div key={index} className="checklist-task">
                            <input type="checkbox" checked={item.checked} readOnly />
                            <span className={item.checked ? 'checked' : ''}>{item.text}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className='card-footer'>
                <div className="task-date">
                    {dueDate && <button className={`date-btn ${getDueDateClass()}`}>{formatDueDate(dueDate)}</button>}
                </div>

                <div className="task-status">
                    {column !== 'backlog' && <button className="task-status-btn" onClick={() => handleStatusChange('backlog')}>BACKLOG</button>}
                    {column !== 'progress' && <button className="task-status-btn" onClick={() => handleStatusChange('in-progress')}>PROGRESS</button>}
                    {column !== 'to-do' && <button className="task-status-btn" onClick={() => handleStatusChange('to-do')}>TO-DO</button>}
                    {column !== 'done' && <button className="task-status-btn" onClick={() => handleStatusChange('done')}>DONE</button>}
                </div>
            </div>

            {shareMessage && <p className="share-message">{shareMessage}</p>}

            <EditTaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} taskId={taskId} currentTitle={title} currentPriority={priority} currentChecklist={checklist} currentDueDate={dueDate} />

            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} />
        </div>
    );
};

export default TaskCard;
