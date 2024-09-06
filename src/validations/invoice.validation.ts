import Joi from 'joi'

export const createInvoiceSchema = Joi.object({
  clientId: Joi.string().optional().messages({
    'string.base': 'Client ID must be a string',
  }),
  oneTimeClient: Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'One-time client name is required',
      'string.base': 'Client name must be a string',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'One-time client email is required',
      'string.email': 'Email must be a valid email address',
    }),
    address: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required().messages({
          'any.required': 'Item description is required',
          'string.base': 'Item description must be a string',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'any.required': 'Quantity is required',
          'number.base': 'Quantity must be a number',
          'number.integer': 'Quantity must be an integer',
          'number.min': 'Quantity must be at least 1',
        }),
        unitPrice: Joi.number().precision(2).required().messages({
          'any.required': 'Unit price is required',
          'number.base': 'Unit price must be a number',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'any.required': 'Items are required',
      'array.base': 'Items must be an array',
      'array.min': 'At least one item is required',
    }),
  dueDate: Joi.date().iso().required().messages({
    'any.required': 'Due date is required',
    'date.base': 'Due date must be a valid date',
    'date.format': 'Due date must be in ISO format',
  }),
})
  .xor('clientId', 'oneTimeClient')
  .messages({
    'object.missing': 'Either clientId or oneTimeClient is required',
  })
