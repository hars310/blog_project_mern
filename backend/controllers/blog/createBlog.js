const Blog = require('../../models/Blog');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Example of how to create a new blog post
const createBlogPost = async (req, res) => {
  const { title, content, tags, images } = req.body;

  try {
    // Create a new blog post with the authenticated user's ID
    const newBlogPost = new Blog({
      title,
      content,
      tags,
      images, // Now multiple images are allowed
      author: userId, // Automatically set the author
    });

    await newBlogPost.save();

    res.status(201).json({
      message: 'Blog post created successfully!',
      blogPost: newBlogPost,
    });
    console.log('Blog post created successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = createBlogPost;
