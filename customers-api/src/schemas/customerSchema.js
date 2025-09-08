// src/schemas/customerSchemas.js
const Joi = require('joi');

// Esquema de creación de cliente
const createCustomerSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'El nombre es obligatorio.',
    'string.empty': 'El nombre es obligatorio.'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico no es válido.',
    'any.required': 'El correo electrónico es obligatorio.',
    'string.empty': 'El correo electrónico es obligatorio.'
  }),
 phone: Joi.string().pattern(/^\+593\d{9}$/).required().messages({
    'string.pattern.base': 'El número de teléfono debe ser un formato válido, como +593991234567.',
    'any.required': 'El número de teléfono es obligatorio.'
 }),
});

// Esquema de actualización de cliente
const updateCustomerSchema = Joi.object({
  name: Joi.string().min(1),
  email: Joi.string().email(),
  phone: Joi.string().min(8)
}).or('name', 'email', 'phone').messages({
  'object.missing': 'Debe proporcionar al menos un campo para actualizar.'
});

module.exports = {
  createCustomerSchema,
  updateCustomerSchema
};