import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Ticket } from "./ticket.entity.js";

const em = orm.em

function sanitizeTicketInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    type: req.body.type,
    row: req.body.row,
    column: req.body.column,
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
    const ticket = await em.find(Ticket, {}, {populate: ['showTicket', 'ticketSale']})
    res.status(200).json({message: 'find all ticket', data: ticket})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ticket = await em.findOneOrFail(Ticket,  id, {populate: ['showTicket', 'ticketSale']})
    res.status(200).json({message: 'found ticket', data: ticket})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const ticket = em.create(Ticket, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'ticket created', data: ticket})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ticket = em.getReference(Ticket, id )
    em.assign(ticket, req.body)
    await em.flush()
    res.status(200).json({message: 'ticket updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const ticket = em.getReference(Ticket, id)
    await em.removeAndFlush(ticket)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'ticket deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeTicketInput, findAll, findOne, create, update, remove }