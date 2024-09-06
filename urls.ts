import express from 'express'
import { loginHandler, registerHandler, verifyEmailHandler } from './src/controllers/auth.controllers'
import { validateRequest } from './src/middlewares/requestValidation'
import { emailVerificationSchema, loginSchema, registerSchema } from './src/validations/auth.validation'
import { createClientSchema } from './src/validations/client.validation'
import { createClientHandler, fetchAllClients, fetchClient } from './src/controllers/client.controller'
import { createInvoiceSchema } from './src/validations/invoice.validation'
import { createInvoiceHandler, fetchAllInvoices, fetchInvoice } from './src/controllers/invoice.controller'

const router = express.Router()

// auth
router.post("/register", validateRequest(registerSchema), registerHandler)
router.post('/email/verify', validateRequest(emailVerificationSchema), verifyEmailHandler)
router.post('/login', validateRequest(loginSchema), loginHandler)

// client
router.post("/clients", validateRequest(createClientSchema), createClientHandler)
router.get('/clients', fetchAllClients)
router.get('/clients/:id',  fetchClient)

// invoice
router.post("/invoices", validateRequest(createInvoiceSchema), createInvoiceHandler)
router.get('/invoices', fetchAllInvoices)
router.get('/invoices/:invoiceId', fetchInvoice)

export default router