import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(null);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');
    if (accessToken) {
      setToken(accessToken);
      fetchFiles(accessToken);
    }
  }, []);

  const authenticate = async () => {
    const { data } = await axios.get('http://localhost:5000/api/auth/google');
    window.location.href = data.authUrl;
  };

  const fetchFiles = async (accessToken) => {
    const { data } = await axios.get('http://localhost:5000/api/drive/files', {
      headers: { Authorization: accessToken },
    });
    setFiles(data);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post('http://localhost:5000/api/drive/upload', formData, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    });
    fetchFiles(token);
  };

  const downloadFile = async (fileId) => {
    const response = await axios.get(`http://localhost:5000/api/drive/files/${fileId}`, {
      headers: { Authorization: token },
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
    await axios.delete(`http://localhost:5000/api/drive/files/${fileId}`, {
      headers: { Authorization: token },
    });
    fetchFiles(token);
  };

  return (
    <div className="App">
      <h1>Google Drive Integration</h1>
      {!token ? (
        <button onClick={authenticate}>Login with Google</button>
      ) : (
        <div>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={uploadFile}>Upload File</button>

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
      )}
    </div>
  );
};

export default App;
