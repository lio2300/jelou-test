// src/middlewares/validate.js
const Joi = require('joi');
const { BadRequestError } = require('../utils/errors');

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    // Si la validación falla, crea un mensaje de error consolidado
    const message = error.details.map(detail => detail.message).join('; ');
    throw new BadRequestError(`Error de validación: ${message}`);
  }

  // Si la validación es exitosa, agrega los datos validados al objeto request
  req.validatedData = value;
  next();
};

module.exports = validate;