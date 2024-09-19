const { google } = require("googleapis");
const { getOAuth2Client } = require("./googleDrive");
const { saveHistory } = require("./aws");
const { Readable } = require('stream');

// Authenticate and get Google Drive instance
const getDriveInstance = (token) => {
  if (!token) {
    throw new Error("Unauthorized: No token found");
  }
  const oAuth2Client = getOAuth2Client();
  oAuth2Client.setCredentials({ access_token: token });
  return google.drive({ version: "v3", auth: oAuth2Client });
};

// Fetch file metadata
const getFileMetadata = async (drive, fileId) => {
  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size, webViewLink, webContentLink",
  });
  return response.data;
};

// Log file history
const logFileHistory = async (
  fileDetails,
  userEmail,
  isSucceed,
  type,
  failedReason = null
) => {
  const logDetails = {
    ...fileDetails,
    createdAt: new Date().toISOString(),
    isSucceed,
    userEmail,
    type,
    failedReason,
  };
  await saveHistory(logDetails);
};

// Convert buffer to stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

module.exports = {
  getDriveInstance,
  getFileMetadata,
  logFileHistory,
	bufferToStream
};
