import React from 'react';
import './DeleteModal.css'; // Add CSS for the modal

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-content">
                <h3>Are you sure you want to delete?</h3>
                <div className="delete-modal-actions">
                    <button className="delete-confirm-btn" onClick={onConfirm}>
                        Yes, Delete
                    </button>
                    <button className="delete-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
