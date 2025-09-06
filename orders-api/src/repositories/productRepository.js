// src/repositories/productRepository.js
const pool = require('../config/database');

class ProductRepository {
    async create(product) {
        const [result] = await pool.execute(
            'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
            [product.name, product.price, product.stock]
        );
        return { id: result.insertId, ...product };
    }

    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, name, price, stock FROM products WHERE id = ?', [id]
        );
        return rows[0] || null;
    }

    async findManyById(ids, connection) {
        const placeholders = ids.map(() => '?').join(',');
        const [rows] = await connection.execute(
            `SELECT id, name, price, stock FROM products WHERE id IN (${placeholders})`, ids
        );
        return rows;
    }

    async search({ search, limit, cursor }) {
        const safeLimit = parseInt(limit, 10) || 20;

        let query = 'SELECT id, name, price, stock FROM products WHERE 1=1';
        let params = [];
        if (search) {
            query += ' AND (name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }
        if (cursor) {
            query += ' AND id > ?';
            params.push(cursor);
        }
        query += ` ORDER BY id ASC LIMIT ${safeLimit}`;
        params.push(limit || 20);
        const [rows] = await pool.execute(query, params);
        const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;
        return { products: rows, nextCursor };
    }

    async update(id, product) {
        const [result] = await pool.execute(
            'UPDATE products SET price = ?, stock = ? WHERE id = ?',
            [product.price, product.stock, id]
        );
        return result.affectedRows > 0;
    }

    async decreaseStock(productId, quantity, connection) {
        const [result] = await connection.execute(
            'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
            [quantity, productId, quantity]
        );
        if (result.affectedRows === 0) {
            throw new BadRequestError('Insufficient stock or product not found.');
        }
    }

    async increaseStock(productId, quantity, connection) {
        const [result] = await connection.execute(
            'UPDATE products SET stock = stock + ? WHERE id = ?',
            [quantity, productId]
        );
        return result.affectedRows > 0;
    }
}
module.exports = new ProductRepository();