const mongoose = require('mongoose');
const Blog = require('../../models/Blog');

const getUserBlogs = async (req, res) => {
  try {
    // Convert `req.user.id` to an ObjectId
    const userId = req.user.id; // Convert string to ObjectId
    // console.log("User ID:", userId);

    // Retrieve blogs for the logged-in user, sorted by most recent
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    // console.log("Blogs:", blogs);

    // Check if the user has no blogs
    if (blogs.length === 0) {
      console.log('No blogs found for this user');
      return res
        .status(200)
        .json({ message: 'No blogs found for this user', blogs });
    }

    // Respond with the list of the user's blogs
    res.status(200).json({
      message: 'User blogs fetched successfully!',
      blogs,
    });
    console.log('User blogs fetched successfully!');
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getUserBlogs;
