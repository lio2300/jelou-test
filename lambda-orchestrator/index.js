// index.js
const axios = require('axios');

// URL de los microservicios, se deben configurar como variables de entorno
const CUSTOMERS_API_URL = process.env.CUSTOMERS_API_URL;
const ORDERS_API_URL = process.env.ORDERS_API_URL;
const SERVICE_TOKEN = process.env.SERVICE_TOKEN;

// Clase de error para manejar los errores HTTP
class LambdaError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
    }
}

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { customer_id, items, idempotency_key, correlation_id } = body;

        // Validar que la idempotency_key esté presente
        if (!idempotency_key) {
            throw new LambdaError('X-Idempotency-Key is required.', 400);
        }

        // Paso 1: Validar cliente en Customers API
        const customerResponse = await axios.get(`${CUSTOMERS_API_URL}/internal/${customer_id}`, {
            headers: { 'Authorization': `Bearer ${SERVICE_TOKEN}` }
        }).catch(err => {
            if (err.response && err.response.status === 404) {
                throw new LambdaError('Customer not found.', 404);
            }
            throw new LambdaError(`Failed to validate customer: ${err.message}`, 500);
        });
        const customer = customerResponse.data.data;

        // Paso 2: Crear la orden en Orders API
        const orderCreationResponse = await axios.post(`${ORDERS_API_URL}/orders`, {
            customer_id,
            items
        }).catch(err => {
            if (err.response && err.response.data && err.response.data.message) {
                throw new LambdaError(`Order creation failed: ${err.response.data.message}`, err.response.status);
            }
            throw new LambdaError(`Failed to create order: ${err.message}`, 500);
        });
        const createdOrder = orderCreationResponse.data;

        // Paso 3: Confirmar la orden usando la clave de idempotencia
        const orderConfirmationResponse = await axios.post(`${ORDERS_API_URL}/orders/${createdOrder.id}/confirm`, {}, {
            headers: { 'X-Idempotency-Key': idempotency_key }
        }).catch(err => {
            if (err.response && err.response.data && err.response.data.message) {
                throw new LambdaError(`Order confirmation failed: ${err.response.data.message}`, err.response.status);
            }
            throw new LambdaError(`Failed to confirm order: ${err.message}`, 500);
        });

        // Paso 4: Consolidar y devolver la respuesta
        const finalOrder = { ...createdOrder, status: 'CONFIRMED' };
        const responseData = {
            success: true,
            correlationId: correlation_id,
            data: {
                customer,
                order: finalOrder
            }
        };

        return {
            statusCode: 201,
            body: JSON.stringify(responseData),
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        console.error('Orchestrator Error:', error);
        return {
            statusCode: error.statusCode || 500,
            body: JSON.stringify({
                success: false,
                correlationId: event.correlation_id || null,
                message: error.message
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};