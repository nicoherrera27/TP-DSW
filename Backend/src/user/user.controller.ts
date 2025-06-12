import { Request, Response, NextFunction } from 'express'
import { User } from './user.entity.js'

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
  res.status(500).json({ message:'Not implemented' })
}

async function findOne (req: Request, res: Response) {
  res.status(500).json({ message:'Not implemented' })
}

async function create (req: Request, res: Response) {
  res.status(500).json({ message:'Not implemented' })
}

async function update (req: Request, res: Response) {
  res.status(500).json({ message:'Not implemented' })
}

async function remove (req: Request, res: Response) {
  res.status(500).json({ message:'Not implemented' })
}


export const user_Controller = { 
  sanitizeUserInput,
  findAll,
  findOne,
  create,
  update,
  remove
}