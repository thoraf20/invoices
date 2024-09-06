import express from 'express'
import { loginHandler, registerHandler, verifyEmailHandler } from './src/controllers/auth.controllers'
import { validateRequest } from './src/middlewares/requestValidation'
import { emailVerificationSchema, loginSchema, registerSchema } from './src/validations/auth.validation'
import { createClientSchema } from './src/validations/client.validation'
import { createClientHandler, fetchAllClients, fetchClient } from './src/controllers/client.controller'

const router = express.Router()

// auth
router.post("/register", validateRequest(registerSchema), registerHandler)
router.post('/email/verify', validateRequest(emailVerificationSchema), verifyEmailHandler)
router.post('/login', validateRequest(loginSchema), loginHandler)

// client
router.post("/clients", validateRequest(createClientSchema), createClientHandler)
router.get('/clients', fetchAllClients)
router.get('/clients/:id',  fetchClient)


export default router