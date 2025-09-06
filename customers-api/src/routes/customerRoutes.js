// src/routes/customerRoutes.js - Definición de rutas
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateServiceToken } = require('../middlewares/authMiddleware');

router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomerById);
router.get('/', customerController.searchCustomers);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;