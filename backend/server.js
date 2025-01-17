const express = require('express');
const cors = require('cors');
const connectDB = require('./db/dbConnect');  // Import MongoDB connection


require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT ; // Default to 3000 if no port in .env

// Establish MongoDB connection
connectDB();  

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Handle JSON requests

// Test route
app.get('/', (req, res) => {
  res.send('Successful response.');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
