const express = require('express');
const cors = require('cors');
const connectDB = require('./db/dbConnect'); // Import MongoDB connection
const RegisterUser = require('./routes/auth/register');
const LoginUser = require('./routes/auth/login');
const blogRoutes = require('./routes/blogs/blogRoutes');
const profilePicture = require('./routes/upload/profilePicture');
const blogImages = require('./routes/upload/blogImages');
const UserDetails = require('./routes/auth/user');
require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT || 3000; // Default to 3000 if no port in .env

// Establish MongoDB connection
connectDB();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Handle JSON requests

// Test route
app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.post('/register', RegisterUser);
app.post('/login', LoginUser);
app.use('/upload', profilePicture);
app.use('/upload', blogImages);
app.use('/user', UserDetails);
app.use('/blog', blogRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
