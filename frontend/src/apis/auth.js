import axios from "axios";
import { BASE_API_URL } from "../utils/constant";

// Get Google OAuth URL for authentication
export const getAuthUrl = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}auth/google`);
    return {
      success: true,
      response,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const checkStatus = async () => {
  try {
		const response = await axios.get(`${BASE_API_URL}auth/status`, { withCredentials: true });
		return {
			success: true,
			response
		}
  } catch (error) {
		return {
			success: false,
			error,
		}
	}
};

export const signOut = async () => {
  try {
		const response = await axios.get(`${BASE_API_URL}auth/logout`, { withCredentials: true });
		return {
			success: true,
			response
		}
  } catch (error) {
		return {
			success: false,
			error,
		}
	}
};
