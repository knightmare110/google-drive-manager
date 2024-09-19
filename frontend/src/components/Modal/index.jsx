import React from "react";

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-2xl font-bold mb-4">Upload Complete</h2>
        <p className="mb-4">
          All files have been uploaded. Do you want to view the file list?
        </p>
        <div className="flex justify-end">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Yes, Show File List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
