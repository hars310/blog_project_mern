const Blog = require('../../models/Blog');
// const checkAuthorOrAdmin = require('../../middlewares/checkAuthorOrAdmin ');

const updateBlog = async (req, res) => {
  const { title, content, tags, images } = req.body;

  try {
    // The checkAuthorOrAdmin middleware ensures that the user is authorized
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id, // Blog ID from the route params
      { title, content, tags, images, updatedAt: Date.now() },
      { new: true }, // Return the updated blog
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    res.status(200).json({
      message: 'Blog post updated successfully!',
      blogPost: updatedBlog,
    });
    console.log('Blog post updated successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = updateBlog;
