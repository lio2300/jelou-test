// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

// Monta las rutas de productos y órdenes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Usa el middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Orders API corriendo en el puerto ${PORT}`);
});