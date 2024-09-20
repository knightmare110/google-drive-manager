import React, { useEffect, useState } from "react";
import { listFiles, downloadFile, deleteFile } from "../../apis/file"; // Import API service
import { FILE_LIST_TABLE_COLUMNS } from "../../utils/constant";
import LoadingSpinner from "../../components/LoadingSpinner";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [prevPageTokens, setPrevPageTokens] = useState([null]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // Loading for file fetching and deletion
  const [deleting, setDeleting] = useState(false); // Specific state for deletion
  const [showModal, setShowModal] = useState(false); // Show confirmation modal
  const [fileToDelete, setFileToDelete] = useState(null); // Track the file to delete

  // Fetch files from the API
  const fetchFiles = async (pageToken = null, page = 1) => {
    setLoading(true);
    const { response, success, error } = await listFiles(pageToken); // Call the API service
    if (success) {
      setFiles(response.data.files); // Update the file list
      setNextPageToken(response.data.nextPageToken || null); // Update nextPageToken for pagination

      if (page > currentPage) {
        setPrevPageTokens([...prevPageTokens, pageToken]); // Store token for this page
      }
      setCurrentPage(page); // Update the current page number
    } else {
      console.error("Error fetching files:", error);
    }
    setLoading(false);
  };

  // Handle download file action
  const handleDownloadFile = async (fileId, fileName) => {
    setLoading(true);
    const { response, success, error } = await downloadFile(fileId); // Call the API service
    if (success) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error("Error downloading file:", error);
    }
    setLoading(false);
  };

  // Show confirmation modal before deletion
  const handleDeleteClick = (fileId) => {
    setFileToDelete(fileId); // Track the file to delete
    setShowModal(true); // Show modal
  };

  // Handle confirmed file deletion
  const handleDeleteFile = async () => {
    setShowModal(false);
    setDeleting(true); // Show loading for delete action
    const { success, error } = await deleteFile(fileToDelete); // Call the API service
    if (success) {
      fetchFiles(); // Refetch the files after deletion
    } else {
      console.error("Error deleting file:", error);
    }
    setDeleting(false);
    setFileToDelete(null); // Reset the file to delete
  };

  // Go to previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      const prevPageToken = prevPageTokens[currentPage - 2];
      fetchFiles(prevPageToken, currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    fetchFiles(nextPageToken, currentPage + 1);
  };

  // Initial load of files
  useEffect(() => {
    fetchFiles();
  }, []);

  // Prepare data for the table
  const tableData = files.map((file) => ({
    id: file.id, // Preserve the id in the data so we can use it in renderRowActions
    name: file.name,
    mimeType: file.mimeType,
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">File List</h2>

      {(loading || deleting) && <LoadingSpinner />}
      <Table
        columns={FILE_LIST_TABLE_COLUMNS}
        data={tableData}
        renderRowActions={(file) => (
          <div className="flex">
            <button
              onClick={() => handleDownloadFile(file.id, file.name)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Download
            </button>
            <button
              data-testid={`delete-button-${file.id}`}
              onClick={() => handleDeleteClick(file.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2"
            >
              Delete
            </button>
          </div>
        )}
      />

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goToPreviousPage}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={currentPage === 1 || loading || deleting}
        >
          Previous
        </button>

        <div>Page {currentPage}</div>

        <button
          onClick={goToNextPage}
          className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!nextPageToken || loading || deleting}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleDeleteFile}
          title="Delete File"
          message="Are you sure you want to delete this file? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default FileList;
