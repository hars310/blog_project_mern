const express = require('express'); // Import express
const createBlogPost = require('../../controllers/blog/createBlog');
const getAllBlogs = require('../../controllers/blog/getAllBlogs');
const updateBlog = require('../../controllers/blog/updateBlog');
const deleteBlog = require('../../controllers/blog/deleteBlog');
const checkAuthorOrAdmin = require('../../middlewares/checkAuthorOrAdmin '); // Correct the import

const router = express.Router();

router.post('/create', createBlogPost);
router.get('/all-blogs', getAllBlogs);
router.put('/:id', checkAuthorOrAdmin, updateBlog);
router.delete('/:id', checkAuthorOrAdmin, deleteBlog);

module.exports = router;
