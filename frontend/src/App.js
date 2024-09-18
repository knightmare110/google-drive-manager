import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const authenticate = async () => {
    const { data } = await axios.get('http://localhost:5000/api/auth/google');
    window.location.href = data.authUrl;
  };

  const fetchFiles = async () => {
    const { data } = await axios.get('http://localhost:5000/api/drive/files', {
      withCredentials: true,
    });
    setFiles(data);
  };

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/status', {
        withCredentials: true, // Include HTTP-only cookies
      });
  
      if (response.data.loggedIn) {
        console.log('User is logged in');
        // Handle logged-in user, e.g., show dashboard
        setIsLoggedIn(true);
        fetchFiles();
      } else {
        console.log('User is not logged in');
        // Handle user not logged in, e.g., show login page
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };  

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);

    await axios.post('http://localhost:5000/api/drive/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true
    });
    fetchFiles();
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
    await axios.delete(`http://localhost:5000/api/drive/files/${fileId}`, {
      withCredentials: true,
    });
    fetchFiles();
  };

  return (
    <div className="App">
      <h1>Google Drive Integration</h1>
      {!isLoggedIn ? (
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
