import mongoose, { Schema, model } from 'mongoose'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice?: number
}

interface OneTimeClient {
  name: string
  email: string
  address?: string
  phone?: string
}

export interface Invoice extends Document {
  userId: string
  clientId?: mongoose.Types.ObjectId // Optional, for saved clients
  oneTimeClient?: OneTimeClient // Optional, for one-time clients
  invoiceNumber: string
  items: InvoiceItem[]
  totalAmount: number
  issueDate: Date
  dueDate: Date
  status: string
}

const InvoiceItemSchema = new Schema<InvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
})

const OneTimeClientSchema = new Schema<OneTimeClient>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
})

const invoiceSchema: Schema<Invoice> = new Schema({
  userId: { type: String, required: true },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false,
  }, // Optional reference
  oneTimeClient: { type: OneTimeClientSchema, required: false }, // Optional embedded client info
  invoiceNumber: { type: String, required: true },
  items: { type: [InvoiceItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: false },
  status: {
    type: String,
    enum: ['PAID', 'UNPAID', 'OVERDUE'],
    default: 'UNPAID',
  },
})

const Invoice = model('Invoice', invoiceSchema)
export default Invoice
