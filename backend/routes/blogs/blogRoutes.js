const express = require('express'); // Import express
const createBlogPost = require('../../controllers/blog/createBlog');
const getAllBlogs = require('../../controllers/blog/getAllBlogs');
const updateBlog = require('../../controllers/blog/updateBlog');
const deleteBlog = require('../../controllers/blog/deleteBlog');
const {checkAuthorOrAdmin} = require('../../middlewares/checkAuthorOrAdmin');
// const {blogDetails} = require('../../middlewares/blogDetails')
const getUserBlogs = require('../../controllers/blog/userBlogs');

const router = express.Router();

router.post('/create', checkAuthorOrAdmin, createBlogPost);
router.get('/all-blogs', getAllBlogs);
router.put('/:id', checkAuthorOrAdmin, updateBlog);
router.delete('/:id', deleteBlog);
router.get('/user-blogs', checkAuthorOrAdmin, getUserBlogs); // Add
module.exports = router;
