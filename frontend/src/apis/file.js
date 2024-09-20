import axios from "axios";
import { BASE_API_URL } from "../utils/constant";

// Fetch the list of files with pagination
export const listFiles = async (pageToken = null) => {
  try {
    const response = await axios.get(`${BASE_API_URL}drive/files`, {
      params: { pageToken },
      withCredentials: true, // Include credentials for authorization
    });
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

// Download a specific file
export const downloadFile = async (fileId) => {
  try {
    const response = await axios.get(`${BASE_API_URL}drive/files/${fileId}`, {
      withCredentials: true,
      responseType: "blob", // Fetch as a blob for file download
    });
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

// Delete a specific file
export const deleteFile = async (fileId) => {
  try {
    const response = await axios.delete(
      `${BASE_API_URL}drive/files/${fileId}`,
      {
        withCredentials: true, // Include credentials for authorization
      }
    );
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

export const uploadFile = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BASE_API_URL}drive/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
      onUploadProgress, // This allows tracking upload progress
    });

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