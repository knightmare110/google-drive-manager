const express = require('express');
const { getAuthUrl, getOAuth2Client } = require('../utils/googleDrive');
const router = express.Router();
const jwt = require('jsonwebtoken');

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
    console.log('t1', code);
    const { tokens } = await oAuth2Client.getToken(code);

    console.log('t2', tokens.id_token);
    const decodedToken = jwt.decode(tokens.id_token);

    console.log('decodedTOken', decodedToken)

    res.cookie('authToken', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date - Date.now()
    });

    res.cookie('authExpiry', tokens.expiry_date, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date - Date.now()
    });

    res.cookie('userEmail', decodedToken.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date - Date.now()
    })

    oAuth2Client.setCredentials(tokens);

    res.redirect(`http://localhost:3000/`);
  } catch (err) {
    res.status(400).send('Error retrieving tokens');
  }
});

router.get('/status', async(req, res) => {
  const token = req.cookies?.authToken || null;
  const expiry = req.cookies?.authExpiry || null;

  if (!token || !expiry) {
    return res.json({ loggedIn: false });
  }

  // Check if the token is expired
  const currentTime = Date.now();
  if (currentTime >= parseInt(expiry)) {
    return res.json({ loggedIn: false });
  }

  return res.json({ loggedIn: true });
})

module.exports = router;
