import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/schemaGenerator.js"; // Adjust the import path as necessary
import { Seat } from "./seat.entity.js";


const em = orm.em

function sanitizeSeatInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    row: req.body.row,
    number: req.body.number,
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
    const seat = await em.find(Seat, {})
    res.status(200).json({message: 'find all seat', data: seat})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const seat = await em.findOneOrFail(Seat,  id )
    res.status(200).json({message: 'found seat', data: seat})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const seat = em.create(Seat, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'seat created', data: seat})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const seat = em.getReference(Seat, id )
    em.assign(seat, req.body)
    await em.flush()
    res.status(200).json({message: 'seat updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const seat = em.getReference(Seat, id)
    await em.removeAndFlush(seat)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'seat deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeSeatInput, findAll, findOne, create, update, remove }