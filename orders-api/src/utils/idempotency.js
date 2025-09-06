// src/utils/idempotency.js
const pool = require('../config/database');

class IdempotencyKeyManager {
    async checkAndSetKey(key, targetType, targetId) {
        const [existing] = await pool.execute('SELECT `key`, response_body, status FROM idempotency_keys WHERE `key` = ?', [key]);

        if (existing.length > 0) {
            const row = existing[0];
            return {
                isDuplicate: true,
                responseBody: row.response_body,
                status: row.status
            };
        }

        await pool.execute('INSERT INTO idempotency_keys (`key`, target_type, target_id, status, created_at) VALUES (?, ?, ?, ?, NOW())',
            [key, targetType, targetId, 'processing']
        );
        return { isDuplicate: false };
    }

    async updateKeyResponse(key, responseBody) {
        await pool.execute('UPDATE idempotency_keys SET status = ?, response_body = ? WHERE `key` = ?',
            ['completed', responseBody, key]
        );
    }

    async markKeyAsFailed(key) {
        await pool.execute('UPDATE idempotency_keys SET status = ? WHERE `key` = ?', ['failed', key]);
    }
}
module.exports = { idempotencyKeyManager: new IdempotencyKeyManager() };