import React, { useState, useEffect } from 'react';
import './EditTaskModal.css';
import axios from 'axios';
import Delete from '../../assets/Delete.png';
import Plus from '../../assets/plus.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTaskModal = ({ isOpen, onClose, taskId }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState([{ text: '', checked: false }]);
    const [dueDate, setDueDate] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isOpen && taskId) {
            fetchTaskDetails();
            fetchUsers();
        }
    }, [isOpen, taskId]);

    const fetchTaskDetails = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) throw new Error("No auth token found");

            const res = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { 'auth-token': token },
            });

            const { task, isCreator } = res.data;

            setTitle(task.title);
            setPriority(task.priority);
            setChecklist(task.checklist);
            setDueDate(task.dueDate ? formatToDMY(task.dueDate) : '');
            setAssignTo(task.assignedTo?._id || '');
            setSelectedUser(task.assignedTo?.email || '');
            setIsCreator(isCreator);
        } catch (err) {
            console.error('Failed to fetch task details:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.get('http://localhost:5000/api/users/getusers', {
                headers: { 'auth-token': token },
            });
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const formatToDMY = (dateStr) => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return !isNaN(date) ? `${day}/${month}/${year}` : '';
    };
    

    const handleChecklistChange = (index, value) => {
        const newChecklist = [...checklist];
        newChecklist[index].text = value;
        setChecklist(newChecklist);
    };

    const handleCheckboxChange = (index) => {
        const newChecklist = [...checklist];
        newChecklist[index].checked = !newChecklist[index].checked;
        setChecklist(newChecklist);
    };

    const addChecklistItem = () => {
        setChecklist([...checklist, { text: '', checked: false }]);
    };

    const removeChecklistItem = (index) => {
        const newChecklist = checklist.filter((_, i) => i !== index);
        setChecklist(newChecklist);
    };

    const formatToYMD = (dateStr) => {
        const date = new Date(dateStr);
        return !isNaN(date) ? date.toISOString().split('T')[0] : '';
    };
    const handleSave = async () => {
        if (!title || !priority || !checklist) {
            setError('Please fill in all required fields.');
            return;
        }

        const taskData = {
            title,
            priority,
            checklist,
            dueDate: formatToYMD(dueDate),
            assignedTo: assignTo,
        };

        try {
            const token = localStorage.getItem('auth-token');
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`, taskData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            setSuccess('Task updated successfully!');
            toast.success('Task updated successfully!');
            setTimeout(() => {
                onClose(); 
                window.location.reload();
            }, 3000); // Adjust delay time as needed
        } catch (err) {
            setError('Failed to update the task. Please try again.');
            toast.error(err)
            console.error(err);
        }
    };

    const handleAssignToSelect = (user) => {
        setAssignTo(user._id);
        setSelectedUser(user.email);
        setShowDropdown(false);
    };

    if (!isOpen) return null;

    return (
        <div className="edit-modal-overlay">
            <ToastContainer />
            <div className="edit-modal-content">
                <label className="edit-input-label">Title</label>
                <input
                    type="text"
                    className="edit-modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Task Title"
                />

                <div className="edit-priority-sec">
                    <label className="edit-input-label">Select Priority</label>
                    <div className="edit-priority-selection">
                        <button
                            className={`edit-priority-option ${priority === 'High' ? 'edit-selected' : ''}`}
                            onClick={() => setPriority('High')}
                        >
                            <span className="edit-priority-dot high-priority"></span> HIGH PRIORITY
                        </button>
                        <button
                            className={`edit-priority-option ${priority === 'Moderate' ? 'edit-selected' : ''}`}
                            onClick={() => setPriority('Moderate')}
                        >
                            <span className="edit-priority-dot moderate-priority"></span> MODERATE PRIORITY
                        </button>
                        <button
                            className={`edit-priority-option ${priority === 'Low' ? 'edit-selected' : ''}`}
                            onClick={() => setPriority('Low')}
                        >
                            <span className="edit-priority-dot low-priority"></span> LOW PRIORITY
                        </button>
                    </div>
                </div>

                <div className="assign-fun">
                    <label className="edit-assign-label">Assign to</label>
                    <input
                        type="text"
                        className="edit-modal-input"
                        value={selectedUser}
                        onClick={() => isCreator && setShowDropdown(!showDropdown)}
                        readOnly={!isCreator}
                        placeholder="Select a user"
                    />
                    {showDropdown && (
                        <div className="assign-dropdown">
                            {users.map((user, index) => (
                                <div key={index} className="assign-dropdown-item" onClick={() => handleAssignToSelect(user)}>
                                    <span className="avatar">{user.name.charAt(0)}{user.name.charAt(1)}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <label className="edit-input-label">Checklist ({checklist.filter(item => item.checked).length}/{checklist.length})</label>
                <div className="edit-checklist-container">
                    {checklist.map((item, index) => (
                        <div key={index} className="edit-checklist-item">
                            <input
                                type="checkbox"
                                className="edit-checklist-checkbox"
                                aria-label={`Checklist checkbox ${index}`}
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleChecklistChange(index, e.target.value)}
                                placeholder="Add a task"
                                className="edit-modal-input edit-checklist-input"
                            />
                            {checklist.length > 1 && (
                                <button
                                    type="button"
                                    className="edit-remove-btn"
                                    onClick={() => removeChecklistItem(index)}
                                >
                                    <img src={Delete} alt="" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" className="edit-add-new-btn" onClick={addChecklistItem}>
                    <img src={Plus} alt="" /> Add New
                </button>

                <div className="edit-footer">
                    <input
                        type="text"
                        className="edit-date-input"
                        onFocus={(e) => {
                            e.target.type = 'date';
                            e.target.showPicker();
                        }}
                        onBlur={(e) => {
                            if (!e.target.value) e.target.type = 'text';
                        }}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="Select Due Date"
                    />

                    <div className="edit-modal-actions">
                        <button type="button" className="edit-cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="edit-save-btn" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>

                {error && <p className="edit-error-message">{error}</p>}
                {success && <p className="edit-success-message">{success}</p>}
            </div>
        </div>
    );
};

export default EditTaskModal;
