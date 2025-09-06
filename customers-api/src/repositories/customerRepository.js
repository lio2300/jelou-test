// src/repositories/customerRepository.js - Capa de acceso a datos
const pool = require('../config/database');

// Patrón Data Mapper o Repository: Separa la lógica de acceso a datos
class CustomerRepository {
    async create(customer) {
        const [result] = await pool.execute(
            'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
            [customer.name, customer.email, customer.phone]
        );
        return { id: result.insertId, ...customer };
    }

    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, name, email, phone, created_at FROM customers WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    }

    async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT id, name, email, phone, created_at FROM customers WHERE email = ?',
            [email]
        );
        return rows[0] || null;
    }

    async search({ search, limit, cursor }) {
        const safeLimit = parseInt(limit, 10) || 20;

        let query = 'SELECT * FROM customers WHERE 1=1';
        let params = [];

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }

        if (cursor) {
            query += ' AND id > ?';
            params.push(cursor);
        }

        query += ` ORDER BY id ASC LIMIT ${safeLimit}`;
        params.push(limit || 20);

        const [rows] = await pool.execute(query, params);
        const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;

        return { customers: rows, nextCursor };
    }

    async update(id, customer) {
        const [result] = await pool.execute(
            'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
            [customer.name, customer.email, customer.phone, id]
        );
        return result.affectedRows > 0;
    }

    async softDelete(id) {
        const [result] = await pool.execute(
            'UPDATE customers SET deleted_at = NOW() WHERE id = ?', // Asumiendo una columna 'deleted_at'
            [id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new CustomerRepository();