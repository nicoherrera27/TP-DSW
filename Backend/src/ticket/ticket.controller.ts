import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Ticket } from "./ticket.entity.js";

const em = orm.em
//Obtenemos la cantidad de tickets vendidos para una funcion con un horario en especifico
async function getSoldCountByTimetable(req: Request, res: Response) {
  try {
    const { timetableId } = req.params;
    if (!timetableId) {
      return res.status(400).json({ message: 'Timetable ID is required' });
    }
    const count = await em.count(Ticket, { timetable: Number(timetableId) });
    res.status(200).json({ data: { soldTicketsCount: count } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


function sanitizeTicketInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    type: req.body.type,
    row: req.body.row,
    column: req.body.column,
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
    const ticket = em.create(Ticket, req.body.sanitizedInput)
    await em.flush()
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
    res.status(200).send({message: 'ticket deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeTicketInput, findAll, findOne, create, update, remove, getSoldCountByTimetable }