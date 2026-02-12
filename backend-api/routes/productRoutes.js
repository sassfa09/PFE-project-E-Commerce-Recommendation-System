const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// --- Import Controllers ---
const productController = require('../controllers/productController');

// --- Import Middlewares ---
// We destructure 'auth' and 'adminMiddleware' from the same file
const { auth, adminMiddleware } = require('../middleware/authMiddleware');

// --- Configure Multer for image storage ---
const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: (req, file, cb) => {
        // Name the file using the current timestamp + original extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
});

// --- Routes ---

// 1. Public routes
// Anyone can view products or filter by category
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getProductsByCategory);

// 2. Protected routes (Admin only)
// 'auth' verifies the token, 'adminMiddleware' checks if the user role is admin

// Route: Add a new product
router.post(
    '/', 
    auth, 
    adminMiddleware, 
    upload.single('image_file'), 
    productController.createProduct
);

// Route: Update an existing product
router.put(
    '/:id', 
    auth, 
    adminMiddleware, 
    upload.single('image_file'), 
    productController.updateProduct
);

// Route: Delete a product
router.delete(
    '/:id', 
    auth, 
    adminMiddleware, 
    productController.deleteProduct
);

module.exports = router;