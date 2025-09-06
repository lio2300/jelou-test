// src/controllers/productController.js
const productService = require('../services/productService');

exports.createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productService.updateProduct(id, req.body);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

exports.searchProducts = async (req, res, next) => {
    try {
        const { search, cursor, limit } = req.query;
        const result = await productService.searchProducts({ search, cursor, limit: parseInt(limit) });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};