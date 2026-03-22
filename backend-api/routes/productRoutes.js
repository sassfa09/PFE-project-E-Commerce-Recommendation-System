const express = require('express');
const router  = express.Router();
const path    = require('path');
const multer  = require('multer');

const productController = require('../controllers/productController');
const { auth, adminMiddleware, optionalAuth } = require('../middleware/authMiddleware');

// Multer config
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Public
router.get('/',                    productController.getAllProducts);
router.get('/category/:id',        productController.getProductsByCategory);
router.get('/:id', optionalAuth,   productController.getProductById); 

// Admin only
router.post('/',    auth, adminMiddleware, upload.single('image_file'), productController.createProduct);
router.put('/:id',  auth, adminMiddleware, upload.single('image_file'), productController.updateProduct);
router.delete('/:id', auth, adminMiddleware,                            productController.deleteProduct);

module.exports = router;