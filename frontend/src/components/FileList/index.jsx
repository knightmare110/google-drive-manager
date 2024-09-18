import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';

const FileList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data } = await axios.get('http://localhost:5000/api/drive/files', {
      withCredentials: true, // Include cookies
    });
    setFiles(data);
  };

  const downloadFile = async (fileId) => {
    const response = await axios.get(`http://localhost:5000/api/drive/files/${fileId}`, {
      withCredentials: true,
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file');
    document.body.appendChild(link);
    link.click();
  };

  const deleteFile = async (fileId) => {
    await axios.delete(`${BASE_API_URL}drive/files/${fileId}`, {
      withCredentials: true,
    });
    fetchFiles();
  };

  return (
    <div>
      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            {file.name} ({file.mimeType})
            <button onClick={() => downloadFile(file.id)}>Download</button>
            <button onClick={() => deleteFile(file.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
