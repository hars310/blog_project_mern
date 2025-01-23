const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blog = require('../models/Blog');

// Middleware to check if the user is the author or admin
const checkAuthorOrAdmin = async (req, res, next) => {
  try {
    // Extract token from authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    // console.log(token)
    if (!token) {
      console.log('No token provided. Please log in');
      return res
        .status(403)
        .json({ message: 'No token provided. Please log in.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user from the database
    const user = await User.findById(userId);
    // console.log("here user",userId)
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (user.role === 'reader') {
      return res
        .status(202)
        .json({ message: "You are reader, you can't create posts" });
      console.log("You are reader, you can't create posts");
    }

    // Extract blog ID from request params (for update/delete routes)
    // const blogId = req.params.id;
    // console.log("here 2",blogId)
    // // Find the blog post by ID
    // const blog = await Blog.findById(blogId);
    // // console.log("here 3",blog)
    // if (!blog) {
    //   return res.status(404).json({ message: 'Blog post not found.' });
    // }

    // // Check if the logged-in user is the author or an admin
    // if (blog.author.toString() !== userId && user.role !== 'admin') {
    //   return res
    //     .status(403)
    //     .json({ message: 'You are not authorized to perform this action.' });
    // }

    // Attach the user object to the request for further use
    req.user = user;
    // req.blog = blog;

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkAuthorOrAdmin;
