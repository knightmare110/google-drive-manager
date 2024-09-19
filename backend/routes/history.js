const express = require('express');
const { listHistory } = require('../controllers/history');

const router = express.Router();

// List all histories
router.get('/', listHistory);

module.exports = router;
