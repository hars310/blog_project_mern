const Blog = require('../../models/Blog');

const getAllBlogs = async (req, res) => {
  try {
    // Retrieve all blog posts from the database, sorted by most recent (createdAt)
    const blogs = await Blog.find().sort({ createdAt: -1 });

    // Check if there are no blogs
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'No blogs found' });
    }

    // Respond with the list of blogs
    res.status(200).json({
      message: 'Blogs fetched successfully!',
      blogs,
    });
    console.log("Blogs fetched successfully!")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = getAllBlogs;
