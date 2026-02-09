const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');


router.post('/', auth, orderController.createOrder);


router.get('/my-orders', auth, orderController.getUserOrders);

module.exports = router;