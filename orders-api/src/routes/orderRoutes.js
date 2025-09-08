// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { createOrderSchema } = require('../schemas/orderSchema');
const validate = require('../middlewares/validate');

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.searchOrders);
router.post('/:id/confirm', orderController.confirmOrder);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;