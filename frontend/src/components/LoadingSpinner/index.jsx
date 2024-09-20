import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div
        role="status" // Role indicating that this element represents a loading status
        aria-label="Loading" // Accessible label for screen readers
        className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"
      />
    </div>
  );
};

export default LoadingSpinner;
