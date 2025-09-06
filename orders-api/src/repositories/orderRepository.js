// src/repositories/orderRepository.js
const pool = require('../config/database');

class OrderRepository {
    async createOrder(customerId, total, items, connection) {
        const [orderResult] = await connection.execute(
            'INSERT INTO orders (customer_id, status, total, created_at) VALUES (?, ?, ?, NOW())',
            [customerId, 'CREATED', total]
        );
        const orderId = orderResult.insertId;
        const itemsToInsert = items.map(item => [orderId, item.product_id, item.qty, item.unit_price, item.subtotal]);
        await connection.query(
            'INSERT INTO order_items (order_id, product_id, qty, unit_price, subtotal) VALUES ?',
            [itemsToInsert]
        );
        return { id: orderId, customer_id: customerId, status: 'CREATED', total, items };
    }

    async findById(id, connection = pool) {
        const [rows] = await connection.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findItemsByOrderId(orderId, connection = pool) {
        const [rows] = await connection.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
        return rows;
    }

    async findOrderWithItems(id) {
        const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
        if (orderRows.length === 0) return null;
        const order = orderRows[0];
        const items = await this.findItemsByOrderId(id);
        return { ...order, items };
    }

    async search({ status, from, to, limit, cursor }) {
        const safeLimit = parseInt(limit, 10) || 20;

        let query = 'SELECT * FROM orders WHERE 1=1';
        let params = [];
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        if (from) {
            query += ' AND created_at >= ?';
            params.push(from);
        }
        if (to) {
            query += ' AND created_at <= ?';
            params.push(to);
        }
        if (cursor) {
            query += ' AND id > ?';
            params.push(cursor);
        }
        query += ` ORDER BY id ASC LIMIT ${safeLimit}`;
        params.push(limit || 20);
        const [rows] = await pool.execute(query, params);
        const nextCursor = rows.length > 0 ? rows[rows.length - 1].id : null;
        return { orders: rows, nextCursor };
    }

    async updateStatus(orderId, newStatus, connection) {
        const [result] = await connection.execute(
            'UPDATE orders SET status = ? WHERE id = ?',
            [newStatus, orderId]
        );
        return result.affectedRows > 0;
    }
}
module.exports = new OrderRepository();