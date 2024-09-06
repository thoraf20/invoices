import { Schema, model } from 'mongoose'

const invoiceSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    enum: ['PAID', 'UNPAID', 'OVERDUE'],
    default: 'UNPAID',
  },
  totalAmount: { type: Number, required: true },
})

const Invoice = model('Invoice', invoiceSchema)
export default Invoice
