// src/routes/internalRoutes.js - Definición de rutas
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateServiceToken } = require('../middlewares/authMiddleware');

// Ruta interna protegida
router.get('/customers/:id', authenticateServiceToken, customerController.getCustomerById);

module.exports = router;