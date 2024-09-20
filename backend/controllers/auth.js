const { getAuthUrl, getOAuth2Client } = require('../utils/googleDrive');
const jwt = require('jsonwebtoken');

// Get Google OAuth URL
const getGoogleAuthUrl = (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.status(200).send({ authUrl });
  } catch (error) {
    res.status(500).send("Failed to get Google Auth URL");
  }
};

// Handle OAuth callback
const googleOAuthCallback = async (req, res) => {
  const { code } = req.query;
  const oAuth2Client = getOAuth2Client();

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    // Decode the id_token to extract user email
    const decodedToken = jwt.decode(tokens.id_token);

    // Set tokens and email in secure cookies
    res.cookie('authToken', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date - Date.now(),
    });

    res.cookie('authExpiry', tokens.expiry_date, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date - Date.now(),
    });

    res.cookie('userEmail', decodedToken.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date - Date.now(),
    });

    // Set credentials for the client (optional)
    oAuth2Client.setCredentials(tokens);

    // Redirect to frontend after successful authentication
    res.redirect(`http://localhost:3000/`);
  } catch (err) {
    res.status(400).send('Error retrieving tokens');
  }
};

// Check authentication status
const checkAuthStatus = (req, res) => {
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
};

const signOut = (req, res) => {
  res.clearCookie('authToken');
  res.clearCookie('authExpiry');
  res.clearCookie('userEmail');
  res.status(200).send('Logged out successfully');
}

module.exports = {
  getGoogleAuthUrl,
  googleOAuthCallback,
  checkAuthStatus,
  signOut
};
