import React, { useState } from 'react';
import './AddTaskModal.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Delete from '../../assets/Delete.png';
import Plus from '../../assets/plus.png';
import API_URL from '../../services/config'

const AddTaskModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState([{ text: '', checked: false }]);
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');

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

    const formatDueDate = (date) => {
        const formattedDate = new Date(date);
        if (!isNaN(formattedDate)) {
            return formattedDate.toISOString().split('T')[0]; 
        }
        return ''; 
    };

    const handleSave = async () => {
        if (!title || !priority || !checklist) {
            const errorMsg = 'Please fill in all required fields.';
            setError(errorMsg);
            toast.error(errorMsg); 
            return;
        }

        const taskData = {
            title,
            priority,
            checklist,
            dueDate: formatDueDate(dueDate),
        };

        try {
            const token = localStorage.getItem('auth-token');
            await axios.post(`${API_URL}/api/tasks`, taskData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });
            
            toast.success('Task added successfully!');
            
            setTimeout(() => {
                onClose(); 
                window.location.reload();
            }, 3000); 
        } catch (err) {
            const errorMsg = 'Failed to add the task. Please try again.';
            setError(errorMsg);
            toast.error(errorMsg); 
            console.error(err);
        }
    };

    const handleCancel = () => {
        onClose();
        window.location.reload();
    };

    const checkedTasks = checklist.filter(item => item.checked).length;
    const totalTasks = checklist.length;

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    className="modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Task Title"
                />

                <div className="priority-sec">
                    <label className="input-label">Select Priority</label>
                    <div className="priority-selection">
                        <button
                            className={`priority-option ${priority === 'High' ? 'selected' : ''}`}
                            onClick={() => setPriority('High')}
                        >
                            <span className="priority-dot high-priority"></span> HIGH PRIORITY
                        </button>
                        <button
                            className={`priority-option ${priority === 'Moderate' ? 'selected' : ''}`}
                            onClick={() => setPriority('Moderate')}
                        >
                            <span className="priority-dot moderate-priority"></span> MODERATE PRIORITY
                        </button>
                        <button
                            className={`priority-option ${priority === 'Low' ? 'selected' : ''}`}
                            onClick={() => setPriority('Low')}
                        >
                            <span className="priority-dot low-priority"></span> LOW PRIORITY
                        </button>
                    </div>
                </div>

                <label className="input-label">Checklist ({checkedTasks}/{totalTasks})</label>
                <div className="checklist-container">
                    {checklist.map((item, index) => (
                        <div key={index} className="checklist-item">
                            <input
                                type="checkbox"
                                className="checklist-checkbox"
                                checked={item.checked}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => handleChecklistChange(index, e.target.value)}
                                placeholder="Add a task"
                                className="modal-input checklist-input"
                            />
                            {checklist.length > 1 && (
                                <button
                                    type="button"
                                    className="remove-btn"
                                    onClick={() => removeChecklistItem(index)}
                                >
                                    <img src={Delete} alt="" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <button type="button" className="add-new-btn" onClick={addChecklistItem}>
                    <img src={Plus} alt="" /> Add New
                </button>

                <div className="footer">
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
                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="button" className="save-btn" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;
