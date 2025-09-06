const express = require('express');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const internalRoutes = require('./routes/internalRoutes');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

// Monta las rutas de los clientes
app.use('/customers', customerRoutes);


// Monta las rutas internas
app.use('/internal', internalRoutes);

// Usa el middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Customers API corriendo en el puerto ${PORT}`);
});