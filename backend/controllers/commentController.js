const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            blog: req.params.blogId, // <- get from route param
            author: req.user.id,
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: 'Create comment failed', error: err.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Optional: Only author or admin can delete
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await comment.remove();
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Delete comment failed', error: err.message });
    }
};
