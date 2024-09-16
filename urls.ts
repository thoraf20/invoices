import express from 'express'
import { loginHandler, registerHandler, verifyEmailHandler } from './src/controllers/auth.controllers'
import { validateRequest } from './src/middlewares/requestValidation'
import { emailVerificationSchema, loginSchema, registerSchema } from './src/validations/auth.validation'
import { createClientSchema } from './src/validations/client.validation'
import { createClientHandler, fetchAllClients, fetchClient, removeClientData, updateClientData } from './src/controllers/client.controller'
import { createInvoiceSchema } from './src/validations/invoice.validation'
import { createInvoiceHandler, deleteInvoiceData, downloadInvoicePDF, fetchAllInvoices, fetchInvoice, sendInvoice, updateInvoiceData } from './src/controllers/invoice.controller'
import { initiatePayment, verifyPayment } from './src/controllers/invoice.payment.controller'

const router = express.Router()

// auth
router.post("/register", validateRequest(registerSchema), registerHandler)
router.post('/email/verify', validateRequest(emailVerificationSchema), verifyEmailHandler)
router.post('/login', validateRequest(loginSchema), loginHandler)

// client
router.post("/clients", validateRequest(createClientSchema), createClientHandler)
router.get('/clients', fetchAllClients)
router.get('/clients/:id',  fetchClient)
router.patch('/clients/:id', updateClientData)
router.delete('/clients/:id', removeClientData)

// invoice
router.post("/invoices", validateRequest(createInvoiceSchema), createInvoiceHandler)
router.post('/invoices/:invoiceId/download', downloadInvoicePDF)
router.post('/invoices/:invoiceId/send', sendInvoice)
router.get('/invoices', fetchAllInvoices)
router.get('/invoices/:invoiceId', fetchInvoice)
router.patch('/invoices/:invoiceId', updateInvoiceData)
router.delete('/invoices/:invoiceId', deleteInvoiceData)

// invoice payment
router.post('/payment/initiate', initiatePayment)
router.post('/payment/verify', verifyPayment)

export default router