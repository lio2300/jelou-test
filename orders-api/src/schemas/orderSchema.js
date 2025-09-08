// src/schemas/orderSchemas.js
const Joi = require('joi');

// Esquema para la creación de una orden
const createOrderSchema = Joi.object({
  customer_id: Joi.number().integer().positive().required().messages({
    'number.base': 'El ID del cliente debe ser un número.',
    'number.integer': 'El ID del cliente debe ser un número entero.',
    'number.positive': 'El ID del cliente no es válido.',
    'any.required': 'El ID del cliente es obligatorio.'
  }),
  items: Joi.array().items(Joi.object({
    product_id: Joi.number().integer().positive().required().messages({
      'number.base': 'El ID del producto debe ser un número.',
      'number.integer': 'El ID del producto debe ser un número entero.',
      'number.positive': 'El ID del producto no es válido.',
      'any.required': 'El ID del producto es obligatorio.'
    }),
    qty: Joi.number().integer().positive().required().messages({
      'number.base': 'La cantidad debe ser un número.',
      'number.integer': 'La cantidad debe ser un número entero.',
      'number.positive': 'La cantidad debe ser un número positivo.',
      'any.required': 'La cantidad es obligatoria.'
    }),
  })).min(1).required().messages({
    'array.min': 'La orden debe contener al menos un producto.',
    'any.required': 'Los ítems son obligatorios.'
  }),
});

module.exports = {
  createOrderSchema
};