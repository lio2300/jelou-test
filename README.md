# B2B Microservices + Lambda Orchestrator

Este repositorio contiene un sistema mínimo compuesto por:

- **Customers API** (Node.js + MySQL)
- **Orders API** (Node.js + MySQL)
- **Lambda Orchestrator** (Node.js, Serverless Framework) que coordina la creación y confirmación de órdenes.

---

## Requisitos

- Docker y Docker Compose
- Node.js 20+
- Serverless Framework (`npm install -g serverless`)

---

## Variables de entorno

Crea un archivo `.env` para cada API con las siguientes variables:

**Customers API (`./customers-api/.env`)**  
```env
DB_HOST=mysql
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
SERVICE_TOKEN=123
```
## Ejemplos de solicitudes (cURL) Customer - API

### Crear cliente
```bash
curl --location 'localhost:3001/customers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Julio",
    "email": "julio@test.com",
    "phone": "093434444"
}'
```
### Obtener todos los cliente
```
curl --location 'localhost:3001/customers' \
--data ''
```
### Obtener cliente
```
curl --location --request PUT 'localhost:3001/customers/1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Julio.",
    "email": "julio@test.com.",
    "phone": "093434444."
}'
```
### Borrado seguro de cliente
```
curl --location --request DELETE 'localhost:3001/customers/1'
```
### Obtener cliente autenticado
```
curl --location 'localhost:3001/internal/customers/1' \
--header 'Authorization: Bearer 123'
```

## Ejemplos de solicitudes (cURL) Orders | Product - API
### Obtener Ordenes
```
curl --location 'localhost:3002/orders'
```
### Obtener Productos
```
curl --location 'localhost:3002/products'
```
### Crear Producto
```
curl --location 'localhost:3002/products' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Carrito",
    "price": 100,
    "stock": 19
}'
```
### Actualizar Producto
```
curl --location --request PATCH 'localhost:3002/products/1' \
--header 'Content-Type: application/json' \
--data '{
    "name": "Carrito feliz",
    "price": 101,
    "stock": 19
}'
```
### Obtener Producto
```
curl --location 'localhost:3002/products/1'
```
### Crear Orden
```
curl --location 'localhost:3002/orders' \
--header 'Content-Type: application/json' \
--data '{
    "customer_id": 1,
    "items": [
        {
            "product_id": 1,
            "qty": 10,
            "unit_price": 12,
            "subtotal": 233
        }
    ]
}'
```
### Obtener Orden
```
curl --location 'localhost:3002/orders/5'
```
### Confirmar orden
```
curl --location 'localhost:3002/orders/5/confirm' \
--header 'X-Idempotency-Key: 5' \
--header 'Content-Type: application/json' \
--data '{
    "customer_id": 1,
    "items": [
        {
            "product_id": 1,
            "qty": 10,
            "unit_price": 12,
            "subtotal": 233
        }
    ]
}'
```
### Cancelar Orden
```
curl --location 'localhost:3002/orders/5/cancel' \
--header 'Content-Type: application/json' \
--data '{
    "customer_id": 1,
    "items": [
        {
            "product_id": 1,
            "qty": 10,
            "unit_price": 12,
            "subtotal": 233
        }
    ]
}'
```

## Ejemplos de solicitudes (cURL) Lambda
### Consumir Lambda local
```
curl --location 'http://localhost:3000/dev/orchestrator/create-and-confirm-order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 123' \
--data '{
    "customer_id": 1,
    "items": [
        {
            "product_id": 1,
            "qty": 3
        }
    ],
    "idempotency_key": "abc-123",
    "correlation_id": "req-789"
}'
```

### Consumir Lambda en AWS
```
curl --location 'https://{AWS}/dev/orchestrator/create-and-confirm-order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer 123' \
--data '{
    "customer_id": 1,
    "items": [
        {
            "product_id": 1,
            "qty": 3
        }
    ],
    "idempotency_key": "abc-123",
    "correlation_id": "req-789"
}'
```