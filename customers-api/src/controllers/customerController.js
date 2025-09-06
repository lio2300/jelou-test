// src/controllers/customerController.js - Controla las peticiones HTTP
const customerService = require('../services/customerService');

// Usando funciones asíncronas para cada endpoint
exports.createCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        next(error); // Pasa el error al middleware de errores
    }
};

exports.getCustomerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await customerService.getCustomerById(id);
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
};

exports.searchCustomers = async (req, res, next) => {
    try {
        const { search, cursor, limit } = req.query;
        console.log({query: req.query});
        
        const result = await customerService.searchCustomers({ search, cursor, limit: parseInt(limit) });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

exports.updateCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await customerService.updateCustomer(id, req.body);
        if (updated) {
            res.status(200).json({ message: 'Customer updated successfully.' });
        } else {
            res.status(404).json({ message: 'Customer not found.' });
        }
    } catch (error) {
        next(error);
    }
};

exports.deleteCustomer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await customerService.deleteCustomer(id);
        if (deleted) {
            res.status(200).json({ message: 'Customer soft-deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Customer not found.' });
        }
    } catch (error) {
        next(error);
    }
};