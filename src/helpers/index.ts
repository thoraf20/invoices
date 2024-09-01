import { StatusCodes } from 'http-status-codes'

export function APIError({
  code,
  message,
  status,
  data,
}: {
  code: number
  message: string
  status: StatusCodes
  data?: any[]
}) {
  this.code = code
  this.message = message
  this.status = status
  this.name = 'APIError'
  this.data = data
}
