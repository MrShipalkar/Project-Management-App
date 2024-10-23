import React, { useState, useEffect } from 'react';
import './EditTaskModal.css'; // Importing a new CSS file
import axios from 'axios';
import Delete from '../../assets/Delete.png';
import Plus from '../../assets/plus.png';

const EditTaskModal = ({ isOpen, onClose, taskId, currentTitle, currentPriority, currentChecklist, currentDueDate }) => {
    const [title, setTitle] = useState(currentTitle || '');
    const [priority, setPriority] = useState(currentPriority || '');
    const [checklist, setChecklist] = useState(currentChecklist || [{ text: '', checked: false }]);
    const [dueDate, setDueDate] = useState(currentDueDate || '');
    const [assignTo, setAssignTo] = useState(''); // New field for "Assign To"
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setTitle(currentTitle);
        setPriority(currentPriority);
        setChecklist(currentChecklist);
        setDueDate(currentDueDate);
    }, [currentTitle, currentPriority, currentChecklist, currentDueDate]);

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

    const handleSave = async () => {
        if (!title || !priority || !checklist) {
            setError('Please fill in all required fields.');
            return;
        }

        const taskData = {
            title,
            priority,
            checklist,
            dueDate,
            assignTo,
        };

        try {
            const token = localStorage.getItem('auth-token');
            const res = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, taskData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            setSuccess('Task updated successfully!');
            onClose();
            window.location.reload();
        } catch (err) {
            setError('Failed to update the task. Please try again.');
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="edit-modal-overlay">
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
                <div className='assign-fun'>
                    <label className="edit-assign-label">Assign to</label>
                    <input
                        type="text"
                        className="edit-modal-input"
                        value={assignTo}
                        onChange={(e) => setAssignTo(e.target.value)}
                        placeholder="Add an assignee"
                    />
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
                        type="date"
                        className="edit-date-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        onClick={(e) => e.target.showPicker()}
                        placeholder="Select"
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
