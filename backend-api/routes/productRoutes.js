const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminMiddleware = require('../middleware/adminMiddleware'); // the middleware we created earlier

// Anyone can view products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getProductsByCategory);

// Only Admin can add a product
// We use two middlewares: first to check authentication, then to verify Admin role
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);

module.exports = router;
