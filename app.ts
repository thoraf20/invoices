import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import 'reflect-metadata'
import connectDB from './src/config/db.config'
import { requestLogger } from './src/middlewares/requestLogger'
import logger from './src/lib/logger'
import { checkJwt, decodeJwt, routesExcludedFromJwtAuthentication, unless } from './src/middlewares/authenticate'
import v1Router from './urls'
import { APIError } from 'src/helpers'

dotenv.config()

// Middleware to log unhandled exceptions
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection:', reason.message)
  if (reason.stack) {
    logger.error(reason.stack)
  } else {
    logger.error('No stack trace available.')
  }
})

const app = express()
const port = process.env.PORT || 3002

app.use(cors())
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ limit: '15mb', extended: true }))
app.use(cookieParser())
app.use(requestLogger)


app.use(unless(routesExcludedFromJwtAuthentication, checkJwt), decodeJwt)
app.use('/v1', v1Router)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ message: err.message, code: err.name, name: err.stack })
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if(error instanceof Error) {
      return (new APIError({
        status: 500,
        message: err.message
      }))
    } else {
      return (
        new APIError({
          status: 500,
          message: 'internal server error',
        })
      )
    }
})

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({ contentSecurityPolicy: false }))
}

connectDB()

app.listen(port, () => {
  logger.info(`Server is up and running at port: ${port}.`)
})

export default app