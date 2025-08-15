import { Request, Response, NextFunction } from 'express';
import { Gender } from './gender.entity.js';
import { orm } from '../shared/db/orm.js';


const em = orm.em 


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

async function findAll2( req:Request, res:Response) {
try {
  const genders = await em.find(Gender, {});
  res.status(200).json({message: 'found all gender', data: genders})
}catch (error:any) {
  res.status(500).json({message: error.message})
}
}

async function findOne2 (req:Request, res:Response) {
try {
  const id = Number.parseInt(req.params.id)
  const gender = await em.findOneOrFail(Gender, {id})
  res.status(200).json({message:'found gender', data:gender})
}catch (error:any) {
  res.status(500).json({message: error.message})
}
}


async function create2 ( req:Request, res:Response) {
  try{
const gender = em.create (Gender, req.body.sanitizedInput)
await em.flush()
res.status(201).json({message: 'gender created', data: gender})
  }catch (error:any) {
    res.status(500).json({message: error.message})
  }
}


async function update2 ( req:Request, res:Response) {
try{
  const id = Number.parseInt(req.params.id)
  const genderToUpdate = await em.findOneOrFail (Gender, {id})
  em.assign(genderToUpdate, req.body.sanitizedInput)
  await em.flush()
  res.status(200).json({message:'gender updated', data: genderToUpdate})
} catch (error:any) {
  res.status(500).json({message: error.message})
}
}


async function delete2 ( req:Request, res:Response) {
try{
  const id = Number.parseInt(req.params.id)
  const gender = em.getReference(Gender, id)
  await em.removeAndFlush(gender)
}catch (error:any) {
  res.status(500).json({message: error.message})
}
}

export { sanitizeGenderInput, findAll2, findOne2, create2, update2, delete2};