// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err); // Loguea el error para fines de depuración

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: true,
        message: message
    });
};

module.exports = errorHandler;