const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Import Middlewares
const { auth, adminMiddleware } = require('../middleware/authMiddleware');

// --- User Routes ---
router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getUserOrders);

// --- Admin Routes ---

// Get all orders for the dashboard
router.get('/all', auth, adminMiddleware, orderController.getAllOrders);

// Update order status (pending -> shipped, etc.)
router.put('/:id/status', auth, adminMiddleware, orderController.updateOrderStatus);


router.get('/:id/items', auth, orderController.getOrderDetails);

module.exports = router;