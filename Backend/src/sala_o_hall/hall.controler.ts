import { Request, Response, NextFunction } from "express";
import { HallRepository } from "./hall.repository2.js";
import { Hall } from "./hall.entity.js";

const Repository2 = new HallRepository()

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

function findAll2(req: Request, res: Response) {
    res.json({data: Repository2.findAll2() })
}

function findOne2(req: Request, res: Response) {
    const id = req.params.id
    const hall = Repository2.findOne2({ id })
    if (!hall) {
        res.status(404).send({ message: 'Hall not found' })
    }
    res.json({ data: hall })
}

function create2(req: Request, res: Response) {
    const Input = req.body.sanitizedInput

    const hallInput = new Hall(Input.number, Input.capacity, Input.id)

    const hall = Repository2.create2(hallInput)
    res.status(201).send({message: 'hall crated', data: hall})
    return
}

function update2(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
 
  const hall = Repository2.update2(req.body.sanitizedInput)
  
  if (!hall) {
    res.status(404).send({ message: 'Hall not found' })
    return
  }

  res.status(200).send({ message: 'Hall updated successfully', data: hall})
  return
}

function delete2(req: Request, res: Response) {
  const id = req.params.id
  const hall = Repository2.delete2({id})

  if(!hall) {
    res.status(404).send({message:'Hall not found'})
  }
  
  res.status(200).send({message: 'Hall deleted successfully' })
  return
}


export { sanitizeHallInput, findAll2, findOne2, create2, update2, delete2 }