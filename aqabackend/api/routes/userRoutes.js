const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protected user routes (require authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
