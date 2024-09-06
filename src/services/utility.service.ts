import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWTPayload } from '../utils/types'

export class Utility {
  generateRandomAlphaNumeric = (length: number) => {
    let s = ''
    Array.from({ length }).some(() => {
      s += Math.random().toString(36).slice(2)
      return s.length >= length
    })
    return s.slice(0, length)
  }

  generateSlug = (name: string): string => {
    return `${name.toLowerCase().replace(/\s+/g, '-')}`
  }

  hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10)
  }

  comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash)
  }

  generateAccessToken = (input: JWTPayload): string => {
    return jwt.sign({ ...input }, `${process.env.JWT_SECRET}`, {
      expiresIn: `${process.env.JWT_SECRET_EXPIRATION}`,
    })
  }

  verifyJWT = (token: string) => {
    try {
      return {
        payload: jwt.verify(token, `${process.env.JWT_SECRET}`),
        expired: false,
      }
    } catch (error) {
      if ((error as Error).name == 'jwt expired') {
        return { payload: jwt.decode(token) as JWTPayload, expired: true }
      }
      throw error
    }
  }
}
