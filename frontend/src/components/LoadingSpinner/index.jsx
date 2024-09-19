import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
