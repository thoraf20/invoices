import { Request, Response, NextFunction } from 'express'
import { ObjectSchema } from 'joi'

export const validateRequest = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.validate(req.body, { abortEarly: false })

    if (validationResult.error) {
      const errors = validationResult.error.details.map(
        (detail) => detail.message
      )
      return res.status(400).json({ errors })
    }

    // Attach the validated data to the request object
    req.body = validationResult.value
    next()
  }
}
