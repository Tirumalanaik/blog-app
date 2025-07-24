
const express = require('express');
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
} = require('../controllers/blogController');

const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router
    .route('/')
    .post(protect, upload.single('image'), createBlog)
    .get(getBlogs);

router
    .route('/:id')
    .get(getBlogById)
    .put(protect, upload.single('image'), updateBlog)
    .delete(protect, deleteBlog);

router.put('/:id/like', protect, toggleLike);

module.exports = router;
