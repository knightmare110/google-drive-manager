import React from 'react';
import FileUpload from '../../components/FileUpload'; // Import the FileUpload component

const Upload = () => {
  return (
    <div className="relative flex items-center justify-center bg-no-repeat bg-cover relative items-center">
      <div className="sm:max-w-lg w-full bg-white rounded-xl z-10">
        <FileUpload /> {/* Render the FileUpload component */}
      </div>
    </div>
  );
};

export default Upload;
