// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const exist = await User.findOne({ email });
        if (exist) return res.status(400).json({ message: 'Email already exists' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user);
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Register failed', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Fetch profile failed', error: err.message });
    }


};
