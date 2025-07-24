const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;

        const imagePath = req.file
            ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
            : '';

        const blog = await Blog.create({
            title,
            content,
            category,
            image: imagePath,
            author: req.user.id
        });

        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Create failed', error: err.message });
    }
};

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name' } 
            })
            .sort({ createdAt: -1 });


        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Fetch blogs failed', error: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name' }
            });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Fetch blog failed', error: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

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
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await blog.deleteOne();

        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed', error: err.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

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
