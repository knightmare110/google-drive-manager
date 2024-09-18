const express = require('express');
const { getAuthUrl, getOAuth2Client } = require('../utils/googleDrive');
const router = express.Router();

// Get Google OAuth URL
router.get('/google', (req, res) => {
  const authUrl = getAuthUrl();
  res.send({ authUrl });
});

// Callback after Google OAuth
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const oAuth2Client = getOAuth2Client();
  
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.redirect(`http://localhost:3000/?token=${tokens.access_token}`);
  } catch (err) {
    res.status(400).send('Error retrieving tokens');
  }
});

module.exports = router;
