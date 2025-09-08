// src/routes/customerRoutes.js - Definición de rutas
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const validate = require('../middlewares/validate');
const { createCustomerSchema, updateCustomerSchema } = require('../schemas/customerSchema');

router.post('/', validate(createCustomerSchema), customerController.createCustomer);
router.get('/:id', validate(updateCustomerSchema), customerController.getCustomerById);
router.get('/', customerController.searchCustomers);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;