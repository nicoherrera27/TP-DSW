import { Request, Response, NextFunction } from 'express'
import { User } from './user.entity.js'
import { UserRepository } from './user.repository.js'

const repository = new UserRepository()

function sanitizeUserInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    id: req.body.id,
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthdate: req.body.birthdate,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll (req: Request, res: Response) {
  const users = await repository.findAll()
  if (!users) {
    res.status(404).send({ message: 'No users found' })
    return
  }
  res.json(await repository.findAll())
  return
}

async function findOne (req: Request, res: Response) {
  const id = req.params.id

  const user = await repository.findOne({id})

  if (!user) {
    res.status(404).send({ message: 'User not found' })
    return
  }

  res.json({ user })
}

async function create (req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const userInput = new User(
    input.id,
    input.username,
    input.password,
    input.name,
    input.surname,
    input.email,
    input.birthdate
  )

  const user = await repository.create(userInput)

  res.status(201).send({ message: 'User created successfully', data: user })
  return  
}

async function update (req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id

  const user= await repository.update (req.params.id, req.body.sanitizedInput)

  if (!user) {
    res.status(404).send({ message: 'User not found' })
    return
  }

  res.status(200).send({ message: 'User updated successfully', data: user })
  return
}

async function remove (req: Request, res: Response) {
  const id = req.params.id

  const user = await repository.delete({id})

  if (!user) {
    res.status(404).send({ message: 'User not found' })
    return
  }

  res.status(200).send({ message: 'User deleted successfully' })
  return  
}


export const user_Controller = { 
  sanitizeUserInput,
  findAll,
  findOne,
  create,
  update,
  remove
}