import { RequestHandler } from 'express'
import { APIError } from '../helpers'
import User from '../models/user.model'
import { comparePassword, generateAccessToken, hashPassword } from '../services/utility.service'


export const registerHandler: RequestHandler = async(req, res, next) => {
  const { email, password, name } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    return next(new APIError({
      status: 409,
      message: 'user account already exists',
    }))
  }

  try {
    const passwordHash = hashPassword(password)

    const user = new User({ email, password: passwordHash, name })

    await user.save()

    return res.status(201).json({ msg: `user account created successfully. Verify your account with code: ${1234}` })
  } catch (error) {
    next()
  }
}

export const verifyEmailHandler: RequestHandler = async(req, res, next) => {
  const { email, code } = req.body

  const userExist = await User.findOne({ email })

  if (!userExist) {
    return next(new APIError({
      status: 404,
      message: 'user account not found',
    }))
  }

  if (code !== '1234') {
     return next(new APIError({
      status: 400,
      message: 'invalid verification code',
    }))
  }

  userExist.emailIsVerified = true

  await userExist.save()

  return res.status(200).json({ msg: `email successfully verified` })
}

export const loginHandler: RequestHandler = async(req, res, next) => {
  const { email, password } = req.body

  const userExist = await User.findOne({ email })

  if (!userExist) {
    return next(new APIError({
      status: 404,
      message: 'user account not found',
    }))
  }

  if (!userExist.emailIsVerified) {
    return next(new APIError({
      status: 401,
      message: `user account is not verified. Please verify you account with the code ${1234}`,
    }))
  }

  const isPasswordMatch = comparePassword(password, `${userExist?.password}`)

  if (!isPasswordMatch) {
    return next(new APIError({
      status: 400,
      message: `invalid login credentials`,
    }))
  }

  const token = generateAccessToken({
    id: userExist.id,
    email
  })

  return res.status(200).json({ msg: `login successful`, token })
}