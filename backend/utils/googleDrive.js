const { google } = require('googleapis');
const { OAuth2 } = google.auth;
require('dotenv').config();

const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'http://localhost:5000/api/auth/google/callback'
);

// Scopes allow the app to access specific functionality on Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.file', 'openid', 'email', 'profile'];

const getAuthUrl = () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  return authUrl;
};

const getOAuth2Client = () => oAuth2Client;

module.exports = {
  getAuthUrl,
  getOAuth2Client,
};
