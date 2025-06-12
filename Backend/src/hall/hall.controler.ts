import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Hall } from "./hall.entity.js";

const em = orm.em

function sanitizeHallInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    number: req.body.number,
    capacity: req.body.capacity,
     id: req.body.id
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    // Sirve para evitar guardar campos vacíos o inválidos en la base de datos
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll (req: Request, res: Response) {
  try{
    const hall = await em.find(Hall, {})
    res.status(200).json({message: 'find all halls', data: hall})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = req.params.id
    const hall = await em.findOneOrFail(Hall, { id })
    res.status(200).json({message: 'found hall', data: hall})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const hall = em.create(Hall, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'hall created', data: hall})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = req.params.id
    const hall = em.getReference(Hall, id )
    em.assign(hall, req.body)
    await em.flush()
    res.status(200).json({message: 'hall updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = req.params.id
    const hall = em.getReference(Hall, id)
    await em.removeAndFlush(hall)
    //em.nativeDelete(Hall, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'hall deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeHallInput, findAll, findOne, create, update, remove }