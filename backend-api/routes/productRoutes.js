const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Import Controllers
const productController = require('../controllers/productController');

// Import Middlewares
const authMiddleware = require('../middleware/authMiddleware'); 
const adminMiddleware = require('../middleware/adminMiddleware');

// --- Configure Multer for image storage ---
const storage = multer.diskStorage({
    destination: 'uploads/', 
    filename: (req, file, cb) => {
        // Name the file using the current timestamp + original extension (jpg/png)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maximum size: 5MB
});

// --- Routes ---

// 1. Public routes (View)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getProductsByCategory);

// 2. Protected routes (Admin only)
// Note: We use authMiddleware first to verify the token,
// then adminMiddleware to verify admin privileges

// Add new product
router.post(
    '/', 
    authMiddleware, 
    adminMiddleware, 
    upload.single('image_file'), 
    productController.createProduct
);

// Update product
router.put(
    '/:id', 
    authMiddleware, 
    adminMiddleware, 
    upload.single('image_file'), 
    productController.updateProduct
);

// Delete product
router.delete(
    '/:id', 
    authMiddleware, 
    adminMiddleware, 
    productController.deleteProduct
);

module.exports = router;
