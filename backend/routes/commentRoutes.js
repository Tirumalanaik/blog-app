

const express = require('express');
const { addComment, deleteComment } = require('../controllers/commentController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/:blogId', protect, addComment);
router.delete('/:commentId', protect, deleteComment);

module.exports = router;
