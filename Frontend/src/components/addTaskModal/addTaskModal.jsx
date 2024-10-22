import React, { useState } from 'react';
import './AddTaskModal.css';
import Delete from '../../assets/Delete.png'
import Plus from '../../assets/plus.png'

const AddTaskModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [checklist, setChecklist] = useState(['']);
    const [dueDate, setDueDate] = useState('');

    const handleChecklistChange = (index, value) => {
        const newChecklist = [...checklist];
        newChecklist[index] = value;
        setChecklist(newChecklist);
    };

    const addChecklistItem = () => {
        setChecklist([...checklist, '']);
    };

    const removeChecklistItem = (index) => {
        const newChecklist = checklist.filter((_, i) => i !== index);
        setChecklist(newChecklist);
    };

    const handleSave = () => {
        // Logic to handle saving the task
        console.log({ title, priority, checklist, dueDate });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <label className="input-label">Title *</label>
                <input
                    type="text"
                    className="modal-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Task Title"
                />

                <div className="priority-sec">
                    <label className="input-label">Select Priority *</label>
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

                <label className="input-label">Checklist (0/0) *</label>
                <div className="checklist-container">
                    {checklist.map((item, index) => (
                        <div key={index} className="checklist-item">
                            <input
                                type="checkbox"
                                className="checklist-checkbox"
                                aria-label={`Checklist checkbox ${index}`}
                            />
                            <input
                                type="text"
                                value={item}
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
                        placeholder='Select'
                    />


                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
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
