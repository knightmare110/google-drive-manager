import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constant";
import LoadingSpinner from "../../components/LoadingSpinner";
import Table from "../../components/Table"; // Import the reusable Table component

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageTokens, setPrevPageTokens] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async (pageToken = null, page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_API_URL}drive/files`, {
        params: { pageToken },
        withCredentials: true,
      });
      setFiles(data.files);
      setNextPageToken(data.nextPageToken || null);
      if (page > currentPage) setPrevPageTokens([...prevPageTokens, pageToken]);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${BASE_API_URL}drive/files/${fileId}`, {
        withCredentials: true,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`${BASE_API_URL}drive/files/${fileId}`, {
        withCredentials: true,
      });
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPageToken = prevPageTokens[currentPage - 2];
      fetchFiles(prevPageToken, currentPage - 1);
    }
  };

  const goToNextPage = () => {
    fetchFiles(nextPageToken, currentPage + 1);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Define columns for the table
  const columns = ["File Name", "MIME Type", "Actions"];

  // Prepare data for the table
  const tableData = files.map((file) => ({
    name: file.name,
    mimeType: file.mimeType,
  }));

  return (
    <div>
      <h2 className="mt-5 text-3xl font-bold text-gray-900">File List</h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Table
          columns={columns}
          data={tableData}
          renderRowActions={(file) => (
            <div className="flex">
              <button
                onClick={() => downloadFile(file.id, file.name)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Download
              </button>
              <button
                onClick={() => deleteFile(file.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
              >
                Delete
              </button>
            </div>
          )}
        />
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goToPreviousPage}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>

        <div>Page {currentPage}</div>

        <button
          onClick={goToNextPage}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!nextPageToken || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FileList;
