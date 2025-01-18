const Blog = require('../../models/Blog');
const User = require('../../models/User');
const jwt = require('jsonwebtoken'); 

// Example of how to create a new blog post
const createBlogPost = async (req, res) => {
  const { title, content, tags, images } = req.body;

  // Authenticate the user using JWT token
  const token = req.headers.authorization?.split(' ')[1];  // Assuming token is passed in the "Authorization" header
  // console.log(token)
  if (!token) {
    return res.status(403).json({ message: 'No token provided. Please log in.' });
  }

  try {
    // Verify the token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Find the user (optional, but ensures the user exists in the system)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Create a new blog post with the authenticated user's ID
    const newBlogPost = new Blog({
      title,
      content,
      tags,
      images,  // Now multiple images are allowed
      author: userId,  // Automatically set the author
    });

    await newBlogPost.save();

    res.status(201).json({
      message: 'Blog post created successfully!',
      blogPost: newBlogPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createBlogPost;
