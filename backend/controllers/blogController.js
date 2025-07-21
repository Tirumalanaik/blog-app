const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create({ ...req.body, author: req.user.id });
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Create failed', error: err.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Fetch blogs failed', error: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name');
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Fetch blog failed', error: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        Object.assign(blog, req.body);
        await blog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await blog.remove();
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        const liked = blog.likes.includes(req.user.id);
        if (liked) {
            blog.likes.pull(req.user.id);
        } else {
            blog.likes.push(req.user.id);
        }
        await blog.save();
        res.json({ likes: blog.likes.length });
    } catch (err) {
        res.status(500).json({ message: 'Like/unlike failed', error: err.message });
    }
};
