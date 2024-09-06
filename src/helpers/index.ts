import { StatusCodes } from 'http-status-codes'

export function APIError({
  status,
  message,
  data,
}: {
  status: StatusCodes
  message: string
  data?: any[]
}) {
  this.status = status
  this.message = message
  this.name = 'APIError'
  this.data = data
}
