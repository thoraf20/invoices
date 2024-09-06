import { RequestHandler } from 'express'
import { APIError } from '../helpers'
import Client from '../models/client.model'


export const createClientHandler: RequestHandler = async(req, res, next) =>{
  const { email } = req.body

  const clientExist = await Client.findOne({ email})

  if (clientExist) {
    return next(new APIError({
      message: 'client already added',
      status: 409
    }))
  }
  
  const newClient = new Client({ ...req.body, user: res.locals.user.id })

  await newClient.save()

  res.status(201).json({ message: 'Client created successfully', data: newClient })
}

export const fetchClient: RequestHandler = async(req, res, next) =>{
  const { id } = req.params

  const client = await Client.findOne({ _id: id, user: res.locals.user.id })

  if (!client) {
    return next(new APIError({
      message: 'client not found.',
      status: 404
    }))
  }

  return res
    .status(201)
    .json({ message: 'Client fetch successfully', data: client })
}

export const fetchAllClients: RequestHandler = async(req, res) =>{

  const clientExist = await Client.find({ user: res.locals.user.id })

  return res
    .status(200)
    .json({ message: 'Clients fetch successfully', data: clientExist })
}