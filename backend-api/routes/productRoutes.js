const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// --- Import Controllers ---
const productController = require('../controllers/productController');

// --- Import Middlewares ---
const { auth, adminMiddleware } = require('../middleware/authMiddleware');

// --- Configure Multer ---
const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- Routes ---

// 1. Public routes
router.get('/', productController.getAllProducts);

// This route is what will call the controller to update the views.
router.get('/:id', productController.getProductById); 

router.get('/category/:id', productController.getProductsByCategory);

// 2. Admin routes
router.post('/', auth, adminMiddleware, upload.single('image_file'), productController.createProduct);
router.put('/:id', auth, adminMiddleware, upload.single('image_file'), productController.updateProduct);
router.delete('/:id', auth, adminMiddleware, productController.deleteProduct);

module.exports = router;