import { RequestHandler } from 'express'
import Invoice from '../models/invoice.model'
import { APIError } from '../helpers'
import { InitializeTransaction, VerifyTransaction } from '../services/utility.service'
import Payment from '../models/payment.model'


export const initiatePayment: RequestHandler = async(req, res, next) => {
  const { invoiceId, amount, email } = req.body

  const invoiceExist = await Invoice.findById(invoiceId).populate('invoiceId')

  if (!invoiceExist) {
    return next (new APIError({
      status: 404,
      message: 'Invoice not found',
    }))
  }

  const response = await InitializeTransaction({
    clientId: String(invoiceExist.clientId),
    invoiceId,
    email: email,
    amount: Number(amount),
  })

  await Payment.create({
    userId: res.locals.user.id,
    invoice: invoiceId,
    paymentReference: response.reference,
    amount: Number(amount),
    status: 'PENDING',
  })

  return response.status(201).json({ 
    msg: 'Payment initiated successfully', 
    data: { paymentReference: response.reference, paymentLink: response.authorization_url} 
  })
}

export const verifyPayment: RequestHandler = async(req, res, next) => {
  const { invoiceId, reference } = req.query

  const payment = await Payment.findOne({ invoice: invoiceId, paymentReference: reference })

  if (!payment) {
    return next (new APIError({
      status: 404,
      message: 'Payment not found',
    }))
  }

  const response = await VerifyTransaction(reference as string)

  const paymentMethod = response.channel === 'card' ? 'CREDIT_CARD' : 'BANK_TRANSFER'

  if (response.status === 'success') {
    await Payment.updateOne(
      { paymentReference: reference },
      { status: 'PAID', method: paymentMethod, paymentDate: new Date() }
    )

    await Invoice.updateOne(
      { _id: invoiceId},
      { status: 'PAID' }
    )

    return res.status(201).json({ msg: 'Payment successful'})
  } else {
    return res.status(402).json({ msg: 'unable to verify payment'})
  }
}