const Comment = require('../models/commentMod');
const Blog = require('../models/Blog');


exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const comment = await Comment.create({
            content,
            blog: req.params.blogId,
            author: req.user.id,
        });

        await Blog.findByIdAndUpdate(
            req.params.blogId,
            { $push: { comments: comment._id } },
            { new: true }
        );

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

        
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        
        await Comment.findByIdAndDelete(req.params.commentId);

        
        await Blog.findByIdAndUpdate(comment.blog, {
            $pull: { comments: comment._id },
        });

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Delete comment failed', error: err.message });
    }
};
