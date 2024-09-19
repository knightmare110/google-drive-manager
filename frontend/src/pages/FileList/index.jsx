import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);

  const fetchFiles = async (pageToken = null) => {
    const { data } = await axios.get(`${BASE_API_URL}drive/files`, {
      params: { pageToken }, // Pass pageToken for pagination
      withCredentials: true,
    });
    setFiles(data.files);
    setNextPageToken(data.nextPageToken);
  };

  // Download file
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}drive/files/${fileId}`, {
        withCredentials: true,
        responseType: 'blob', // Ensure response is treated as a file
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Set filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${BASE_API_URL}drive/files/${fileId}`, {
        withCredentials: true,
      });
      // Remove the file from the list after successful deletion
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File List</h2>
      <table className="w-full bg-white shadow-md rounded mb-4">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4">File Name</th>
            <th className="py-2 px-4">MIME Type</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className="py-2 px-4">{file.name}</td>
              <td className="py-2 px-4">{file.mimeType}</td>
              <td className="py-2 px-4 flex space-x-2">
                <button
                  onClick={() => downloadFile(file.id, file.name)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        {nextPageToken && (
          <button onClick={() => fetchFiles(nextPageToken)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FileList;
