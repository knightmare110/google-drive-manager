import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';
import LoadingSpinner from '../../components/LoadingSpinner'; // Import the new loading spinner component

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageTokens, setPrevPageTokens] = useState([null]); // Store tokens for previous pages
  const [currentPage, setCurrentPage] = useState(1); // Track the current page number
  const [loading, setLoading] = useState(false); // Track loading state

  // Fetch files from the API
  const fetchFiles = async (pageToken = null, page = 1) => {
    setLoading(true); // Start loading
    try {
      const { data } = await axios.get(`${BASE_API_URL}drive/files`, {
        params: { pageToken }, // Pass pageToken for pagination
        withCredentials: true,
      });

      setFiles(data.files); // Update the file list
      setNextPageToken(data.nextPageToken || null); // Update nextPageToken for pagination

      if (page > currentPage) {
        setPrevPageTokens([...prevPageTokens, pageToken]); // Store token for this page
      }

      setCurrentPage(page); // Update the current page number
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Handle download file action
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}drive/files/${fileId}`, {
        withCredentials: true,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Handle delete file action
  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${BASE_API_URL}drive/files/${fileId}`, {
        withCredentials: true,
      });
      setFiles(files.filter((file) => file.id !== fileId)); // Remove the file from the list
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPageToken = prevPageTokens[currentPage - 2]; // Get the token for the previous page
      fetchFiles(prevPageToken, currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    fetchFiles(nextPageToken, currentPage + 1); // Fetch next page
  };

  // Initial load of files
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File List</h2>

      {/* Loading spinner or message */}
      {loading ? (
        <LoadingSpinner />
      ) : (
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
                    disabled={loading} // Disable button when loading
                  >
                    Download
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    disabled={loading} // Disable button when loading
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goToPreviousPage}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === 1 || loading} // Disable if on the first page or loading
        >
          Previous
        </button>

        {/* Display current page */}
        <div>Page {currentPage}</div>

        <button
          onClick={goToNextPage}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!nextPageToken || loading} // Disable if no nextPageToken or loading
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FileList;
