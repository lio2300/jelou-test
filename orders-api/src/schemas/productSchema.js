// src/schemas/productSchemas.js
const Joi = require('joi');

// Esquema para la creación de un nuevo producto
const createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'El nombre del producto es obligatorio.',
    'string.empty': 'El nombre del producto es obligatorio.'
  }),
  price: Joi.number().integer().positive().required().messages({
    'number.base': 'El precio debe ser un número.',
    'number.integer': 'El precio debe ser un número entero.',
    'number.positive': 'El precio debe ser un número positivo.',
    'any.required': 'El precio es obligatorio.'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'El stock debe ser un número.',
    'number.integer': 'El stock debe ser un número entero.',
    'number.min': 'El stock no puede ser negativo.',
    'any.required': 'El stock es obligatorio.'
  }),
});

// Esquema para la actualización de un producto (solo precio o stock)
const updateProductSchema = Joi.object({
  price: Joi.number().integer().positive().messages({
    'number.base': 'El precio debe ser un número.',
    'number.integer': 'El precio debe ser un número entero.',
    'number.positive': 'El precio debe ser un número positivo.'
  }),
  stock: Joi.number().integer().min(0).messages({
    'number.base': 'El stock debe ser un número.',
    'number.integer': 'El stock debe ser un número entero.',
    'number.min': 'El stock no puede ser negativo.'
  }),
}).or('price', 'stock').messages({
  'object.missing': 'Debe proporcionar al menos el precio o el stock para actualizar.'
});

module.exports = {
  createProductSchema,
  updateProductSchema
};