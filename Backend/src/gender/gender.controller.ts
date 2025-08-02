import { Request, Response, NextFunction } from 'express';
import { GenderRepository2 } from './gender.repository2.js';
import { Gender } from './gender.entity.js';


const repository2 = new GenderRepository2 ()

function sanitizeGenderInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    name: req.body.name,
    id: req.body.id
  }

Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) 
    {delete req.body.sanitizedInput[key]
    }
  })
next()
}
function findAll2( req:Request, res:Response) {
 res.json({data: repository2.findAll2()})
}

function findOne2 (req:Request, res:Response) {
const id = req.params.id
 const gender = repository2.findOne2({id})
 if(!gender){
  res.status(404).send({message:'Gender no found'})
  return
 }
 res.json({data: gender})
}

function create2 ( req:Request, res:Response) {
  const input = req.body.sanitizedInput

  const genderInput = new Gender
  (input.id, 
    input.name)
  
  const gender = repository2.create2 (genderInput) 
  res.status(201).send({ message: 'Gender created', data: gender})
  return
  }

function update2 ( req:Request, res:Response) {
  req.body.sanitizedInput.id = parseInt(req.params.id)
const gender = repository2.update2(req.params.id, req.body.sanitizedInput )

if(!gender) {
  res.status(404).send({ message: 'Gender not found' })
  return
}
res.status(200).send({message: 'Gender updated successfully', data: gender })
return
}

 function delete2 ( req:Request, res:Response) {
  const id = req.params.id
const gender = repository2.delete2({id})

if(!gender) {
  res.status(404).send({ message: 'Gender not found' })
  return}
  else{
  res.status(200).send({ message: 'Gender deleted successfully' })
  return
}
}


export const controller = {
  sanitizeGenderInput,
  findAll2,
  findOne2
}

export { sanitizeGenderInput, findAll2, findOne2, create2, update2
, delete2
 };