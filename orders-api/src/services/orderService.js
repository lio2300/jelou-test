// src/services/orderService.js
const pool = require('../config/database');
const customerClient = require('../config/services');
const orderRepository = require('../repositories/orderRepository');
const productRepository = require('../repositories/productRepository');
const { idempotencyKeyManager } = require('../utils/idempotency');
const { NotFoundError, BadRequestError, ConflictError } = require('../utils/errors');
const axios = require('axios');

class OrderService {
    async createOrder(orderData) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 1. Validar cliente en Customers API
            try {
                const customerResponse = await axios.get(`${customerClient.customersApiUrl}/internal/customers/${orderData.customer_id}`, {
                    headers: { 'Authorization': `Bearer ${process.env.SERVICE_TOKEN}` }
                });
                if (customerResponse.status !== 200) {
                    throw new BadRequestError('Customer not found or invalid.');
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    throw new BadRequestError('Customer not found.');
                }
                throw new Error('Failed to validate customer with Customers API.');
            }

            // 2. Verificar stock y precios
            const productIds = orderData.items.map(item => item.product_id);
            const products = await productRepository.findManyById(productIds, connection);
            if (products.length !== productIds.length) {
                throw new BadRequestError('One or more products not found.');
            }
            let total = 0;
            const orderItems = [];
            for (const item of orderData.items) {
                const product = products.find(p => p.id === item.product_id);
                if (product.stock < item.qty) {
                    throw new BadRequestError(`Insufficient stock for product with ID: ${product.id}.`);
                }
                await productRepository.decreaseStock(product.id, item.qty, connection);
                const subtotal = product.price * item.qty;
                total += subtotal;
                orderItems.push({
                    product_id: product.id, qty: item.qty,
                    unit_price: product.price, subtotal
                });
            }

            // 3. Crear la orden y sus ítems
            const order = await orderRepository.createOrder(orderData.customer_id, total, orderItems, connection);
            await connection.commit();
            return order;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async confirmOrder(orderId, idempotencyKey) {
        // 1. Manejo de Idempotencia
        const idempotencyResult = await idempotencyKeyManager.checkAndSetKey(idempotencyKey, 'order_confirmation', orderId);
        if (idempotencyResult.isDuplicate) {
            return idempotencyResult.responseBody;
        }

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // 2. Obtener la orden y verificar estado
            const order = await orderRepository.findById(orderId, connection);
            if (!order) {
                throw new NotFoundError('Order not found.');
            }
            if (order.status !== 'CREATED') {
                throw new ConflictError('Order cannot be confirmed. Current status is not CREATED.');
            }

            // 3. Actualizar estado a CONFIRMED
            const updated = await orderRepository.updateStatus(orderId, 'CONFIRMED', connection);
            if (!updated) {
                throw new Error('Failed to update order status.');
            }
            await connection.commit();
            const responseBody = { message: 'Order confirmed successfully.', orderId };
            await idempotencyKeyManager.updateKeyResponse(idempotencyKey, responseBody);
            return responseBody;

        } catch (error) {
            await connection.rollback();
            await idempotencyKeyManager.markKeyAsFailed(idempotencyKey);
            throw error;
        } finally {
            connection.release();
        }
    }

    async cancelOrder(orderId) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        try {
            const order = await orderRepository.findById(orderId, connection);
            if (!order) {
                throw new NotFoundError('Order not found.');
            }
            // Regla de cancelación: CONFIRMED solo dentro de 10 minutos
            if (order.status === 'CONFIRMED') {
                const now = new Date();
                const confirmedAt = new Date(order.created_at);
                const timeDiffMinutes = Math.abs(now - confirmedAt) / (1000 * 60);
                if (timeDiffMinutes > 10) {
                    throw new BadRequestError('Confirmed orders can only be canceled within 10 minutes.');
                }
            }
            // Restaurar stock (si la orden no estaba ya cancelada)
            if (order.status !== 'CANCELED') {
                const orderItems = await orderRepository.findItemsByOrderId(orderId, connection);
                for (const item of orderItems) {
                    await productRepository.increaseStock(item.product_id, item.qty, connection);
                }
            }
            // Actualizar el estado a CANCELED
            const updated = await orderRepository.updateStatus(orderId, 'CANCELED', connection);
            if (!updated) {
                throw new Error('Failed to cancel order.');
            }
            await connection.commit();
            return { message: 'Order canceled successfully.' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async getOrderById(id) {
        const order = await orderRepository.findOrderWithItems(id);
        if (!order) {
            throw new NotFoundError('Order not found.');
        }
        return order;
    }

    async searchOrders(params) {
        return orderRepository.search(params);
    }
}
module.exports = new OrderService();