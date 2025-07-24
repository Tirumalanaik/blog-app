const express = require('express');
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
} = require('../controllers/userController');
const protect = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getAllUsers); 

module.exports = router;
