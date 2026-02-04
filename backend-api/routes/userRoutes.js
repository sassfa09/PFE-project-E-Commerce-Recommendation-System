const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminMiddleware = require('../middleware/adminMiddleware'); 


router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);


router.get('/all-users', authMiddleware, adminMiddleware, userController.getAllUsers);

module.exports = router;