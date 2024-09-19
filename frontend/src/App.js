import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Upload from './pages/Upload';
import FileList from './pages/FileList';
import History from './pages/History';
import Login from './pages/Login';
import { BASE_API_URL } from './utils/constant';
import './index.css'; // Import Tailwind CSS

const Sidebar = ({ onSignOut }) => (
  <div className="w-64 bg-gray-800 text-white h-full">
    <ul className="space-y-4 p-4">
      <li>
        <a href="/upload" className="block p-4 hover:bg-gray-700 rounded-lg">Upload</a>
      </li>
      <li>
        <a href="/file-list" className="block p-4 hover:bg-gray-700 rounded-lg">File List</a>
      </li>
      <li>
        <a href="/history" className="block p-4 hover:bg-gray-700 rounded-lg">History</a>
      </li>
      <li>
        <button onClick={onSignOut} className="block w-full p-4 hover:bg-gray-700 rounded-lg text-left">
          Sign Out
        </button>
      </li>
    </ul>
  </div>
);

const PrivateRoute = ({ element: Component, isLoggedIn, ...rest }) => {
  return isLoggedIn ? <Component {...rest} /> : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}auth/status`, { withCredentials: true });
        setIsLoggedIn(response.data.loggedIn);
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const signOut = async () => {
    try {
      await axios.post(`${BASE_API_URL}auth/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state until login status is resolved
  }

  return (
    <Router>
      <div className="flex h-screen">
        {isLoggedIn && <Sidebar onSignOut={signOut} />}
        <div className="flex-grow p-6 bg-gray-100">
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/upload" />} />
            <Route path="/upload" element={<PrivateRoute isLoggedIn={isLoggedIn} element={Upload} />} />
            <Route path="/file-list" element={<PrivateRoute isLoggedIn={isLoggedIn} element={FileList} />} />
            <Route path="/history" element={<PrivateRoute isLoggedIn={isLoggedIn} element={History} />} />
            <Route path="/" element={<Navigate to={isLoggedIn ? "/upload" : "/login"} />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/upload" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
