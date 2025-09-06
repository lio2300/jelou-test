// src/utils/errors.js
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = 400;
    }
}
class ConflictError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflictError';
        this.statusCode = 409;
    }
}
module.exports = { NotFoundError, BadRequestError, ConflictError };