const express = require('express');
const multer = require('multer');
const { listFiles, uploadFile, downloadFile, deleteFile } = require('../controllers/drive');

const router = express.Router();
const upload = multer(); // Multer middleware to handle file uploads

// List all files in Google Drive
router.get('/files', listFiles);

// Upload a file to Google Drive
router.post('/upload', upload.single('file'), uploadFile); // Here, we handle file uploads with multer

// Download a file from Google Drive
router.get('/files/:fileId', downloadFile);

// Delete a file from Google Drive
router.delete('/files/:fileId', deleteFile);

module.exports = router;
