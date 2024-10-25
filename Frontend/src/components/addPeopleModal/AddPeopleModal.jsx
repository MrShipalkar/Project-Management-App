import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AddPeopleModal.css';

const AddPeopleModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const modalRef = useRef(null);

    const handleAddEmail = async () => {
        try {
            const token = localStorage.getItem('auth-token');
    
            // Assign tasks created by the current user to the specified user by email
            await axios.patch('http://localhost:5000/api/tasks/assign', { email }, {
                headers: { 'auth-token': token },
            });
    
            // Set success message
            setSuccessMessage(`${email} added to board`);
        } catch (error) {
            console.error('Error assigning tasks:', error);
            setErrorMessage('user not found with this email');
        }
    };

    // Function to reset modal data
    const resetModal = () => {
        setEmail('');
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleOkayClick = () => {
        resetModal();
        onClose(); // Close the modal after resetting
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleOkayClick();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="add-people-modal-overlay">
            <div className="add-people-modal-content" ref={modalRef}>
                {!successMessage ? (
                    <>
                        <h3>Add people to the board</h3>
                        <input
                            type="email"
                            placeholder="Enter the email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="add-people-modal-actions">
                            <button className="add-people-cancel-btn" onClick={handleOkayClick}>
                                Cancel
                            </button>
                            <button className="add-people-add-btn" onClick={handleAddEmail}>
                                Add Email
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='add-people-successmsg'>{successMessage}</p>
                        <button className="add-people-success-btn" onClick={handleOkayClick}>
                            Okay, got it!
                        </button>
                    </>
                )}
                {errorMessage && <p className="add-people-error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default AddPeopleModal;
