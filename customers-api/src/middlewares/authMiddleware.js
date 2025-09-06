// src/middlewares/authMiddleware.js - Para el endpoint interno
const authenticateServiceToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token && token === process.env.SERVICE_TOKEN) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized: Invalid or missing service token.' });
    }
};

module.exports = { authenticateServiceToken };