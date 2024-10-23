import React, { useState } from 'react';
import './AddTaskModal.css';
import axios from 'axios'; // Add Axios for making HTTP requests
import Delete from '../../assets/Delete.png';
import Plus from '../../assets/plus.png';

const AddTaskModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState([{ text: '', checked: false }]);
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        };

        try {
            const token = localStorage.getItem('auth-token'); // Assuming you're storing the JWT token here
            const res = await axios.post('http://localhost:5000/api/tasks', taskData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token, // Pass the token in the headers
                },
            });
            
            setSuccess('Task added successfully!');
            onClose(); // Close the modal after a successful save
            window.location.reload();
        } catch (err) {
            setError('Failed to add the task. Please try again.');
            console.error(err);
        }
    };

    const handleCancel = () => {
        // Close the modal and reload the page when cancel is clicked
        onClose();
        window.location.reload();
    };

    // Count how many tasks are checked
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

                {/* Display checklist progress */}
                <label className="input-label">Checklist ({checkedTasks}/{totalTasks})</label>
                <div className="checklist-container">
                    {checklist.map((item, index) => (
                        <div key={index} className="checklist-item">
                            <input
                                type="checkbox"
                                className="checklist-checkbox"
                                aria-label={`Checklist checkbox ${index}`}
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
                        type="date"
                        className="Date-input"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        onClick={(e) => e.target.showPicker()}  // Explicitly trigger the date picker when clicked
                        placeholder="Select"
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

                {/* Show error or success messages */}
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
            </div>
        </div>
    );
};

export default AddTaskModal;
