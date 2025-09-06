// src/controllers/orderController.js
const orderService = require('../services/orderService');

exports.createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

exports.searchOrders = async (req, res, next) => {
    try {
        const { status, from, to, cursor, limit } = req.query;
        const result = await orderService.searchOrders({ status, from, to, cursor, limit: parseInt(limit) });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.confirmOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const idempotencyKey = req.header('X-Idempotency-Key');
        if (!idempotencyKey) {
            throw new BadRequestError('X-Idempotency-Key header is required.');
        }
        const result = await orderService.confirmOrder(id, idempotencyKey);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await orderService.cancelOrder(id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};