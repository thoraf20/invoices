import express from 'express'
import { loginHandler, registerHandler, verifyEmailHandler } from './src/controllers/auth.controllers'
import { validateRequest } from './src/middlewares/requestValidation'
import { emailVerificationSchema, loginSchema, registerSchema } from './src/validations/auth.validation'

const router = express.Router()

// auth
router.post("/register", validateRequest(registerSchema), registerHandler)
router.post('/email/verify', validateRequest(emailVerificationSchema), verifyEmailHandler)
router.post('/login', validateRequest(loginSchema), loginHandler)


export default router