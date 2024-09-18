import React from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constant';

const Login = () => {
  const authenticate = async () => {
    const { data } = await axios.get(`${BASE_API_URL}auth/google`);
    window.location.href = data.authUrl; // Redirect to Google OAuth
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={authenticate}>Login with Google</button>
    </div>
  );
};

export default Login;
