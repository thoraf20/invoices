import { Schema, model } from 'mongoose'

const paymentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  paymentDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['CREDIT_CARD', 'BANK_TRANSFER', 'PAYPAL'],
    required: true,
  },
})

const Payment = model('Payment', paymentSchema)
export default Payment
