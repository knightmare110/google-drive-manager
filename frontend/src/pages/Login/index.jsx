import React from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';

const Login = () => {
  const authenticate = async () => {
    const { data } = await axios.get(`${BASE_API_URL}auth/google`);
    window.location.href = data.authUrl; // Redirect to Google OAuth
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <button 
        onClick={authenticate} 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
