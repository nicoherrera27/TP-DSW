import { Request, Response, NextFunction } from 'express';
import { GenderRepository } from './gender.repository2.js';
import { Gender } from './gender.entity.js';


const repository2 = new GenderRepository()

function sanitizeGenderInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll2( req:Request, res:Response) {
 const genders = await repository2.findAll2()
 if (!genders){
  res.status(404).send({message: 'No genders found'})
  return
 }
 res.json(genders)
 return
}

async function findOne2 (req:Request, res:Response) {
  const id = req.params.id

  const gender = await repository2.findOne2({id})

  if(!gender){
    res.status(404).send({message:'Gender no found'})
    return
  }

  res.json({data: gender})
}

async function create2 ( req:Request, res:Response) {
  const input = req.body.sanitizedInput

  const genderInput = new Gender(
    input.id, 
    input.name
  )
  
  const gender = await repository2.create2(genderInput)

  res.status(201).send({ message: 'Gender created', data: gender})
  return
  }

async function update2 (req:Request, res:Response) {
  req.body.sanitizedInput.id = req.params.id

  const gender = await repository2.update2(req.params.id, req.body.sanitizedInput)

  if(!gender) {
    res.status(404).send({ message: 'Gender not found' })
    return
  }
  res.status(200).send({message: 'Gender updated successfully', data: gender })
  return
}

async function delete2 (req:Request, res:Response) {
  const id = req.params.id

  const gender = await repository2.delete2({id})

  if(!gender) {
    res.status(404).send({ message: 'Gender not found' })
    return
  }
  
  res.status(200).send({ message: 'Gender deleted successfully' })
  return
  
}


export const gender_Controller = {
  sanitizeGenderInput,
  findAll2,
  findOne2,
  create2,
  update2,
  delete2
}

