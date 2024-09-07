import { RequestHandler } from 'express'
import Client from '../models/client.model'
import Invoice, { InvoiceItem } from '../models/invoice.model'
import { APIError } from '../helpers'
import { generateInvoicePDF } from '../services/utility.service'
import path from 'path'

export const createInvoiceHandler: RequestHandler = async(req, res, next) => {
  const { clientId, oneTimeClient, items, dueDate } = req.body

  let client 
  if (clientId) {
    client = await Client.findById(clientId)
    if (!client) {
      return next(new APIError({
      message: 'saved client not found',
      status: 404
    }))
    }
  }

  let totalAmount = 0
  items.forEach((item: InvoiceItem) => {
    item.totalPrice = item.quantity * item.unitPrice
    totalAmount += item.totalPrice
  })

  const invoiceData = {
    userId: res.locals.user.id,
    clientId: client ? client._id : undefined, // Use saved client if provided
    oneTimeClient: oneTimeClient || undefined, // Use one-time client if provided
    invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
    dueDate,
    items,
    totalAmount,
    status: 'UNPAID',
  }

  const invoice = new Invoice(invoiceData)
  await invoice.save()

  return res.status(201).json({ msg: "Invoice successfully created", data: invoice})
}

export const downloadInvoicePDF = async(req, res, next) => {
  const { invoiceId } = req.params

  const invoiceDetails = await Invoice.findById(invoiceId).populate('clientId')

  if (!invoiceDetails) {
    return next(new APIError({
      message: 'invoice not found',
      status: 404
    }))
  }

  const outputPath = path.join(__dirname, `../../invoices/invoice-${invoiceDetails.invoiceNumber}.pdf`);
  const invoicePDF = generateInvoicePDF(invoiceDetails, outputPath)

  return res
    .status(201)
    .json({ msg: 'Invoice successfully created', data: { invoice: invoicePDF} })
}

export const sendInvoice = async(req, res, next) => {
  const { invoiceId } = req.params

  const invoiceDetails = await Invoice.findById(invoiceId).populate('clientId')

  if (!invoiceDetails) {
    return next(new APIError({
      message: 'invoice not found',
      status: 404
    }))
  }

  //TODO: send invoice to client
}

export const fetchAllInvoices: RequestHandler = async(_req, res) => {
  const invoices = await Invoice.find({ userId: res.locals.user.id })

  return res
    .status(200)
    .json({ msg: 'Invoices successfully fetch', data: invoices })
}

export const fetchInvoice: RequestHandler = async (req, res, next) => {
  const { invoiceId } = req.params

  const invoice = await Invoice.findById(invoiceId)

  if (!invoice) {
      return next(new APIError({
      message: 'saved client not found',
      status: 404
    }))
  }

  return res
    .status(200)
    .json({ msg: 'Invoice successfully fetch', data: invoice })
}
