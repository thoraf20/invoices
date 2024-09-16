import { Schema, model } from 'mongoose'

const paymentSchema = new Schema({
  userId: { type: String, required: true },
  invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  paymentReference: { type: String, required: true },
  paymentDate: { type: Date, required: false },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['CREDIT_CARD', 'BANK_TRANSFER'],
    required: true,
    defaultValue: 'BANK_TRANSFER',
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID'],
    required: true,
    defaultValue: 'PENDING',
  },
})

const Payment = model('Payment', paymentSchema)
export default Payment
