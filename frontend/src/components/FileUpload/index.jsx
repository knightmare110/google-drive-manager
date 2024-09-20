import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { uploadFile } from "../../apis/file"; // Import the upload function from the api utility

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setUploadProgress(
      selectedFiles.map(() => ({ progress: 0, status: "pending" }))
    );
  };

  // Upload files one by one using the API util function
  const uploadFiles = async () => {
    const newUploadProgress = [...uploadProgress];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Update status to "uploading"
        newUploadProgress[i].status = "uploading";
        setUploadProgress([...newUploadProgress]);

        // Call the API to upload the file
        const { success } = await uploadFile(file, (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          newUploadProgress[i].progress = percentCompleted;
          setUploadProgress([...newUploadProgress]);
        });

        // Update status based on success or failure
        if (success) {
          newUploadProgress[i].status = "completed";
        } else {
          newUploadProgress[i].status = "failed";
        }
        setUploadProgress([...newUploadProgress]);
      } catch (error) {
        // Update status to "failed" in case of error
        newUploadProgress[i].status = "failed";
        setUploadProgress([...newUploadProgress]);
        console.error("Error uploading file:", error);
      }
    }

    // Open modal after all uploads are done
    if (files.length > 0) setIsModalOpen(true);
  };

  // Handle modal confirmation
  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/file-list");
  };

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title="Upload Complete"
        message="All files have been uploaded. Do you want to view the file list?"
        confirmText="Yes, Show File List"
        cancelText="Cancel"
      />

      <div className="sm:max-w-lg w-full p-10 bg-white rounded-xl z-10">
        <div className="text-center">
          <h2 className="mt-5 text-3xl font-bold text-gray-900">File Upload</h2>
          <p className="mt-2 text-sm text-gray-400">
            Upload files to Google Drive
          </p>
        </div>

        <div className="grid grid-cols-1 space-y-2">
          <label
            htmlFor="file-upload"
            className="text-sm font-bold text-gray-500 tracking-wide"
          >
            Attach Documents
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
              <div className="h-full w-full text-center flex flex-col items-center justify-center">
                <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                  <img
                    className="has-mask h-36 object-center"
                    src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                    alt="Upload"
                  />
                </div>
                <p className="pointer-none text-gray-500">
                  <span className="text-sm">Drag and drop</span> files here{" "}
                  <br /> or{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    select files
                  </a>{" "}
                  from your computer
                </p>
              </div>
              {/* Make sure the input has an ID */}
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          onClick={uploadFiles}
          data-testid="upload-button"
          className="my-5 w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
        >
          Upload Files
        </button>
      </div>

      {/* Scrollable container for upload progress */}
      <div className="max-h-80 overflow-y-auto space-y-4">
        {/* Set a max height and enable vertical scrolling */}
        {files.map((file, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1000).toFixed(2)} KB
                </p>
              </div>
              <div>
                {/* Show progress bar */}
                <div className="w-full bg-gray-300 rounded h-2">
                  <div
                    className={`h-full ${
                      uploadProgress[index]?.status === "completed"
                        ? "bg-green-500"
                        : uploadProgress[index]?.status === "failed"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${uploadProgress[index]?.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {uploadProgress[index]?.progress}% -{" "}
                  {uploadProgress[index]?.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
