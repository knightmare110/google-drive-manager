import React from 'react';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';

const Dashboard = () => {
  return (
    <div
				className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
				style={{
					backgroundImage:
						"url(https://images.unsplash.com/photo-1621243804936-775306a8f2e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)",
				}}
			>
      {/* Render the file upload and file listing components */}
      <FileUpload />
      <FileList />
    </div>
  );
};

export default Dashboard;
