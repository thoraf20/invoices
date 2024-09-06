import Joi from "joi"

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref('password'),
})

export const emailVerificationSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(4).required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})