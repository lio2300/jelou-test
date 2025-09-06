// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.patch('/:id', productController.updateProduct);
router.get('/:id', productController.getProductById);
router.get('/', productController.searchProducts);

module.exports = router;