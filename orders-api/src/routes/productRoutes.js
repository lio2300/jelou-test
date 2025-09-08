// src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { createProductSchema, updateProductSchema } = require('../schemas/productSchema');
const validate = require('../middlewares/validate');

router.post('/',validate(createProductSchema), productController.createProduct);
router.patch('/:id', validate(updateProductSchema), productController.updateProduct);
router.get('/:id', productController.getProductById);
router.get('/', productController.searchProducts);

module.exports = router;