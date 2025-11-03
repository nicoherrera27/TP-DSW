import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Sale } from "./sale.entity.js";
import { Ticket } from "../ticket/ticket.entity.js";
import { Show } from "../show/show.entity.js";
import { TicketType } from "../ticket_type/ticketType.entity.js";
import { User } from "../user/user.entity.js";

const em = orm.em.fork();

interface AuthRequest extends Request {
  user?: { id: number; username: string; role: 'admin' | 'client' };
}

function sanitizeSaleInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    amount: req.body.amount,
    dateTime: req.body.date_and_time,
    total_price: req.body.total_price,
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
    const sale = await em.find(Sale, {})
    res.status(200).json({message: 'find all sale', data: sale})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const sale = await em.findOneOrFail(Sale,  id )
    res.status(200).json({message: 'found sale', data: sale})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const sale = em.create(Sale, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'sale created', data: sale})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const sale = em.getReference(Sale, id )
    em.assign(sale, req.body)
    await em.flush()
    res.status(200).json({message: 'sale updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const sale = em.getReference(Sale, id)
    await em.removeAndFlush(sale)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'sale deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function createSimulatedSale(req: AuthRequest, res: Response) {
  const em = orm.em.fork();
  try {
    const { showId, tickets, totalPrice } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }

    if (!showId || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ message: 'Datos de la compra inválidos.' });
    }
  
    const show = await em.findOne(Show, { id: Number(showId) }, { populate: ['showRoom'] });
    if (!show || !show.showRoom) {
      return res.status(404).json({ message: 'Función o sala no encontrada.' });
    }

    const roomCapacity = show.showRoom.capacity;
    const soldTicketsCount = await em.count(Ticket, { showTicket: Number(showId) });
    const requestedTicketsCount = tickets.reduce((sum: number, ticket: any) => sum + ticket.quantity, 0);
    const availableCapacity = roomCapacity - soldTicketsCount;

    if (requestedTicketsCount > availableCapacity) {
      return res.status(409).json({ 
        message: `Capacidad excedida. Solo quedan ${availableCapacity} asientos disponibles.` 
      });
    }
    
    const newSale = em.create(Sale, {
      amount: requestedTicketsCount,
      total_price: totalPrice,
      dateTime: new Date(),
      userSale: em.getReference(User, userId) // <-- ¡ASÍ SE ASIGNA EL USUARIO!
    });

    const showRef = em.getReference(Show, Number(showId));

    for (const ticket of tickets) {
      const ticketTypeRef = ticket.typeId ? em.getReference(TicketType, Number(ticket.typeId)) : undefined;
      
      for (let i = 0; i < ticket.quantity; i++) {
        const newTicket = em.create(Ticket, {
          type: ticket.typeId ? 'Bonificado' : 'General',
          ticketSale: newSale,
          showTicket: showRef,
          ticketType: ticketTypeRef
        });
        em.persist(newTicket);
      }
    }
    
    await em.flush();
    
    res.status(201).json({ message: 'Venta registrada con éxito.', saleId: newSale.id });

  } catch (error: any) {
    console.error('Error al crear venta simulada:', error);
    res.status(500).json({ message: error.message });
  }
}




export { sanitizeSaleInput, findAll, findOne, create, update, remove, createSimulatedSale}