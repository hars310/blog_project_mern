const Blog = require('../../models/Blog');
// const checkAuthorOrAdmin = require('../../middlewares/checkAuthorOrAdmin');

const deleteBlog = async (req, res) => {
  try {
    // The checkAuthorOrAdmin middleware ensures that the user is authorized
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id); // Delete blog by ID

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog post not found.' });
    }

    res.status(200).json({
      message: 'Blog post deleted successfully!',
    });
    console.log('Blog post deleted successfully!', 'blog id: ', req.params.id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = deleteBlog;
