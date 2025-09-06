// src/services/productService.js
const productRepository = require('../repositories/productRepository');
const { ConflictError, NotFoundError } = require('../utils/errors');

class ProductService {
    async createProduct(productData) {
        return productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        const updated = await productRepository.update(id, productData);
        if (!updated) {
            throw new NotFoundError('Product not found.');
        }
        return { message: 'Product updated successfully.' };
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new NotFoundError('Product not found.');
        }
        return product;
    }

    async searchProducts(params) {
        return productRepository.search(params);
    }
}
module.exports = new ProductService();