const express = require('express');
const cors = require('cors');
const connectDB = require('./db/dbConnect'); // Import MongoDB connection
const RegisterUser = require('./routes/auth/register');
const LoginUser = require('./routes/auth/login');
const createBlogPost = require('./routes/blogs/createBlog');
const getAllBlogs = require('./routes/blogs/getAllBlogs');

require('dotenv').config(); // Load environment variables
const app = express();
const port = process.env.PORT; // Default to 3000 if no port in .env

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

app.post('/blog/create', createBlogPost);
app.get('/blog/all-blogs',getAllBlogs)

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}.`);
});
