const express = require('express');
const { getGoogleAuthUrl, googleOAuthCallback, checkAuthStatus, signOut } = require('../controllers/auth');

const router = express.Router();

// Route to get Google OAuth URL
router.get('/google', getGoogleAuthUrl);

// Route for handling Google OAuth callback
router.get('/google/callback', googleOAuthCallback);

// Route to check authentication status
router.get('/status', checkAuthStatus);

router.post('/logout', signOut);

module.exports = router;
