import React from 'react';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';

const Dashboard = () => {
  return (
    <div>
      {/* Render the file upload and file listing components */}
      <FileUpload />
      <FileList />
    </div>
  );
};

export default Dashboard;
