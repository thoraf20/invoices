import mongoose from 'mongoose'
import dotenv from 'dotenv'
import logger from '../lib/logger'

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    logger.info('MongoDB connected...')
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

export default connectDB
