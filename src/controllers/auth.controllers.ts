import { RequestHandler } from 'express'
import { APIError } from '../helpers'
import User from '../models/user.model'
import { hashPassword } from '../services/utility.service'


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