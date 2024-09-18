import React, { useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post(`${BASE_API_URL}drive/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // Include cookies
    });
    setFile(null); // Clear the file input after upload
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default FileUpload;
