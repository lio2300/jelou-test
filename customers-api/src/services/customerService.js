// src/services/customerService.js - Lógica de negocio
const customerRepository = require('../repositories/customerRepository');
const { ConflictError, NotFoundError } = require('../utils/errors');

// Lógica de negocio: Validaciones, composición de datos, etc.
class CustomerService {
    async createCustomer(customerData) {
        const existingCustomer = await customerRepository.findByEmail(customerData.email);
        if (existingCustomer) {
            throw new ConflictError('Customer with this email already exists.');
        }
        return customerRepository.create(customerData);
    }

    async getCustomerById(id) {
        const customer = await customerRepository.findById(id);
        if (!customer) {
            throw new NotFoundError('Customer not found.');
        }
        return customer;
    }

    async searchCustomers(params) {
        return customerRepository.search(params);
    }

    async updateCustomer(id, customerData) {
        const customer = await customerRepository.findById(id);
        if (!customer) {
            throw new NotFoundError('Customer not found.');
        }
        // Lógica para verificar email único en caso de cambio
        if (customerData.email && customerData.email !== customer.email) {
            const existingCustomer = await customerRepository.findByEmail(customerData.email);
            if (existingCustomer && existingCustomer.id !== id) {
                throw new ConflictError('Customer with this new email already exists.');
            }
        }
        return customerRepository.update(id, customerData);
    }

    async deleteCustomer(id) {
        const customer = await customerRepository.findById(id);
        if (!customer) {
            throw new NotFoundError('Customer not found.');
        }
        return customerRepository.softDelete(id);
    }
}

module.exports = new CustomerService();