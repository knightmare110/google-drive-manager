import React, { useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../utils/constant";

const Upload = () => {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${BASE_API_URL}drive/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Include cookies
    });
    setFile(null); // Clear the file input after upload
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-4"
      />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
};

export default Upload;
