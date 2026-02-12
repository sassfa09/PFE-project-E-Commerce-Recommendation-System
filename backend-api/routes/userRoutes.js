const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// Correct Import
const { auth, adminMiddleware } = require('../middleware/authMiddleware');

// 1. User Profile Routes

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

// 2. Admin Only Routes

router.get('/all-users', auth, adminMiddleware, userController.getAllUsers);

module.exports = router;