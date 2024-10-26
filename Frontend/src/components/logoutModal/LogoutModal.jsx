import React from 'react';
import './LogoutModal.css'; // Add CSS for the modal

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay">
            <div className="logout-modal-content">
                <h3>Are you sure you want to Logout?</h3>
                <div className="logout-modal-actions">
                    <button className="logout-confirm-btn" onClick={onConfirm}>
                        Yes, Log out
                    </button>
                    <button className="logout-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationModal;
