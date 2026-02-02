const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


// ==========================================================
// Routes
// ==========================================================

// Get all products
router.get('/', productController.getAllProducts);

// Get single product by ID
router.get('/:id', productController.getProductById);

// Add new product
router.post('/add', productController.addProduct);


module.exports = router;
