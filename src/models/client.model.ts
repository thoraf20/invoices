import { Schema, model } from 'mongoose'

const clientSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
})

const Client = model('Client', clientSchema)
export default Client
