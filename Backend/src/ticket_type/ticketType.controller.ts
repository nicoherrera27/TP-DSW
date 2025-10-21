import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { TicketType } from "./ticketType.entity.js";
const em = orm.em

function sanitizeTicketTypeInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    description: req.body.description,
    bonification: req.body.bonification
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
    const ticketTypes = await em.find(TicketType, {})
    res.status(200).json({message: 'find all ticket types', data: ticketTypes})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ticketType = await em.findOneOrFail(TicketType,  id )
    res.status(200).json({message: 'found ticket type', data: ticketType})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const ticketType = em.create(TicketType, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'ticket type created', data: ticketType})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ticketType = em.getReference(TicketType, id )
    em.assign(ticketType, req.body)
    await em.flush()
    res.status(200).json({message: 'ticket type updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ticketType = em.getReference(TicketType, id)
    await em.removeAndFlush(ticketType)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'ticket type deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeTicketTypeInput, findAll, findOne, create, update, remove }