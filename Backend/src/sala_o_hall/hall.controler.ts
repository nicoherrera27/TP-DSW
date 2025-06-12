import { Request, Response, NextFunction } from "express";
import { HallRepository } from "./hall.repository.js";
import { Hall } from "./hall.entity.js";
import { hallRouter } from "./hall.routes.js";

const Repository = new HallRepository()

function sanitizeHallInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    number: req.body.number,
    capacity: req.body.capacity,
     id: req.body.id
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll (req: Request, res: Response) {
  const hall = await Repository.findAll()
  if (!hall) {
    res.status(404).send({ message: 'No users found' })
    return
  }
  res.json(await Repository.findAll())
  return
}

async function findOne (req: Request, res: Response) {
  const id = req.params.id
  const hall = await Repository.findOne({id})
  if (!hall) {
    res.status(404).send({ message: 'User not found' })
    return
  }

  res.json({ hall })
}

async function create (req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const hallInput = new Hall(
    input.id,
    input.capacity,
    input.number,
  )

  const hall = await Repository.create(hallInput)

  res.status(201).send({ message: 'User created successfully', data: hall })
  return  
}

async function update (req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id

  const hall= await Repository.update (req.params.id, req.body.sanitizedInput)

  if (!hall) {
    res.status(404).send({ message: 'Hall not found' })
    return
  }

  res.status(200).send({ message: 'Hall updated successfully', data: hall })
  return
}

async function remove(req: Request, res: Response) {
  const id = req.params.id

  const hall = await Repository.delete({id})

  if (!hall) {
    res.status(404).send({ message: 'Hall not found' })
    return
  }

  res.status(200).send({ message: 'Hall deleted successfully' })
  return  
}


export { sanitizeHallInput, findAll, findOne, create, update, remove }