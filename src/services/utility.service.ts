import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWTPayload } from '../utils/types'
import PDFDocument from 'pdfkit'
import fs from 'fs'
import { InvoiceItem } from '../models/invoice.model'
import path from 'path'
import axios from 'axios'

export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10)
}

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const generateAccessToken = (input: JWTPayload): string => {
  return jwt.sign({ ...input }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_SECRET_EXPIRATION}`,
  })
}

export const generateInvoicePDF = (invoice: any, outputPath: string): void => {
  const directoryPath = path.dirname(outputPath)

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true }) // Create directory if it doesn't exist
  }
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 })

  // Pipe its output to a file or a response
  const stream = fs.createWriteStream(outputPath)
  doc.pipe(stream)

  // Add Invoice header
  doc.fontSize(20).text('Invoice', { align: 'center' }).moveDown()

  // doc.image('path/to/logo.png', 50, 30, { width: 100 })
  // doc.moveDown(3) // Adds some space after the image

  // Add Client Information (either saved or one-time client)
  if (invoice.clientId) {
    doc.fontSize(12).text(`Client: ${invoice.clientId.name}`)
    doc.text(`Email: ${invoice.clientId.email}`)
    if (invoice.clientId.address)
      doc.text(`Address: ${invoice.clientId.address}`)
    if (invoice.clientId.phone) doc.text(`Phone: ${invoice.clientId.phone}`)
  } else if (invoice.oneTimeClient) {
    doc.fontSize(12).text(`Client: ${invoice.oneTimeClient.name}`)
    doc.text(`Email: ${invoice.oneTimeClient.email}`)
    if (invoice.oneTimeClient.address)
      doc.text(`Address: ${invoice.oneTimeClient.address}`)
    if (invoice.oneTimeClient.phone)
      doc.text(`Phone: ${invoice.oneTimeClient.phone}`)
  }

  // Add Invoice metadata
  doc.moveDown()
  doc.text(`Invoice Number: ${invoice.invoiceNumber}`)
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`)
  doc.text(`Status: ${invoice.status}`)
  doc.moveDown()

  // Add table headers
  doc.fontSize(14).text('Itemized Bill')
  doc.moveDown()
  doc.fontSize(10)
  doc.text('Description', 50, 200, { bold: true })
  doc.text('Quantity', 300, 200)
  doc.text('Unit Price', 400, 200)
  doc.text('Total Price', 500, 200)
  doc.moveDown()

  // Add each item in the invoice
  let position = 220
  invoice.items.forEach((item: InvoiceItem) => {
    doc.text(item.description, 50, position)
    doc.text(item.quantity, 300, position)
    doc.text(item.unitPrice.toFixed(2), 400, position)
    doc.text(
      (item.totalPrice || item.quantity * item.unitPrice).toFixed(2),
      500,
      position
    )
    position += 20
  })

  // Add total amount
  doc.moveDown()
  doc
    .fontSize(12)
    .text(`Total Amount: $${invoice.totalAmount.toFixed(2)}`, {
      align: 'right',
    })

  // Finalize the PDF and end the document
  doc.end()

  // Optionally, you can listen to stream finish event to handle success or failure
  stream.on('finish', () => {
    console.log(`Invoice PDF generated successfully at ${outputPath}`)
  })

  stream.on('error', (err) => {
    console.error(`Error generating invoice PDF: ${err.message}`)
  })
};

export const InitializeTransaction = async (data: {
  clientId: string
  invoiceId: string, 
  email: string
  amount: number
}) => {
  try {
    const apiUrl = 'https://api.paystack.co/transaction/initialize'

    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    }

    const metadata = {
      custom_fields: [
        {
          display_name: 'clientId',
          variable_name: 'clientId',
          value: data.clientId,
        },
        {
          display_name: 'invoiceId',
          variable_name: 'invoiceId',
          value: data.invoiceId,
        },
      ],
    }

    const payload = {
      email: data.email,
      amount: data.amount * 100,
      metadata,
    }

    const response = await axios.post(apiUrl, payload, { headers })

    return response.data.data
  } catch (error) {
    console.error('Error while initializing payment link:', error)
    throw error // Re-throw the error so that the caller can handle it if needed
  }
}

export const VerifyTransaction = async (reference: string) => {
  try {
    const apiUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const headers = {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };

    const response = await axios.get(apiUrl, { headers });

    return response.data.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error; // Re-throw the error so that the caller can handle it if needed
  }
}