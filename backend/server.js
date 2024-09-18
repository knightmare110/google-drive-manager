const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Importing authentication routes
const driveRoutes = require('./routes/drive'); // Importing drive routes

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for frontend-backend communication

// Routes
app.use('/api/auth', authRoutes); // Route for authentication (OAuth2)
app.use('/api/drive', driveRoutes); // Route for Drive operations

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
