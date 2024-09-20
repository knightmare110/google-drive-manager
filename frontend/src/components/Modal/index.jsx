import React from "react";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmation", // Default title
  message = "Are you sure?", // Default message
  confirmText = "Confirm", // Default confirm button text
  cancelText = "Cancel", // Default cancel button text
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
      role="dialog" // Added role for accessibility
      aria-labelledby="modal-title" // Connects the title to the dialog
      aria-describedby="modal-description" // Connects the description to the dialog
    >
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 id="modal-title" className="text-2xl font-bold mb-4">
          {title}
        </h2>
        <p id="modal-description" className="mb-4">
          {message}
        </p>
        <div className="flex justify-end">
          <button
            data-testid="cancel-button"
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            data-testid="confirm-button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
