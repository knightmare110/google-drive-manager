import React from "react";
import { getAuthUrl } from "../../apis/auth"; // Import the new API service

const Login = () => {
  const authenticate = async () => {
    const { response, success, error } = await getAuthUrl(); // Use the API service
    if (success) {
      window.location.href = response.data.authUrl; // Redirect to Google OAuth
    } else {
      console.error("Error getting auth URL:", error);
    }
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
