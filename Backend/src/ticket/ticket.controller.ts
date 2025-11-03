// Backend/src/ticket/ticket.controller.ts
import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Ticket } from "./ticket.entity.js";
import { Sale } from "../sale/sale.entity.js";        // Import Sale
import { Show } from "../show/show.entity.js";        // Import Show
import { TicketType } from "../ticket_type/ticketType.entity.js"; // Import TicketType
import { Timetable } from "../time_table/timetable.entity.js"; // <-- IMPORT Timetable

const em = orm.em.fork(); // Use fork for concurrent requests

function sanitizeTicketInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    type: req.body.type, // Consider generating this uniquely in create
    row: req.body.row,
    column: req.body.column,
    ticketSaleId: req.body.ticketSaleId, // Expecting ID for Sale relation
    showTicketId: req.body.showTicketId, // Expecting ID for Show relation
    ticketTypeId: req.body.ticketTypeId, // Expecting ID for TicketType relation (optional)
    timetableId: req.body.timetableId,   // <-- ADD timetableId
    id: req.body.id // Usually not needed for creation
  };

  // Basic check for required IDs (adjust as needed)
  if (!req.body.sanitizedInput.ticketSaleId || !req.body.sanitizedInput.showTicketId || !req.body.sanitizedInput.timetableId) {
       return res.status(400).json({ message: 'Faltan IDs requeridos: ticketSaleId, showTicketId y timetableId son necesarios.' });
  }


  Object.keys(req.body.sanitizedInput).forEach((key) => {
    // Sirve para evitar guardar campos vacíos o inválidos en la base de datos
    // Keep 0 for row/column if provided explicitly
    if (req.body.sanitizedInput[key] === undefined && key !== 'row' && key !== 'column') {
      delete req.body.sanitizedInput[key];
    }
    // Remove id for creation if present
    if (key === 'id') {
         delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function findAll (req: Request, res: Response) {
  try{
    // Populate relations you might need when listing tickets
    const tickets = await em.find(Ticket, {}, {populate: ['ticketSale', 'showTicket', 'ticketType', 'timetable']});
    res.status(200).json({message: 'find all ticket', data: tickets});
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' });
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    // Populate relations needed for single ticket view
    const ticket = await em.findOneOrFail(Ticket,  id, {populate: ['ticketSale', 'showTicket', 'ticketType', 'timetable']});
    res.status(200).json({message: 'found ticket', data: ticket});
  } catch (error: any){
    res.status(500).json({ message: error.message});
  }
}


async function create (req: Request, res: Response) {
  try{
    const input = req.body.sanitizedInput;

    const ticket = em.create(Ticket, {
      // Generate a unique type/code here if needed, or receive it
      type: input.type || `TICKET-${Date.now()}`, // Example generation
      row: input.row, // Optional, depends on your system
      column: input.column, // Optional
      // --- Assign relations using getReference ---
      ticketSale: em.getReference(Sale, input.ticketSaleId),
      showTicket: em.getReference(Show, input.showTicketId),
      timetable: em.getReference(Timetable, input.timetableId), // <-- ASSIGN timetable
    });

    // Assign optional TicketType
    if (input.ticketTypeId) {
        ticket.ticketType = em.getReference(TicketType, input.ticketTypeId);
    }

    await em.persistAndFlush(ticket); // flush saves the entity to the DB

    // Optionally find the created ticket again to populate relations for the response
    const createdTicket = await em.findOne(Ticket, { id: ticket.id }, { populate: ['ticketSale', 'showTicket', 'ticketType', 'timetable'] });

    res.status(201).json({ message: 'ticket created', data: createdTicket }); // Return the created ticket with relations

  } catch (error: any){
    console.error("Error creating ticket:", error); // Log the detailed error
    res.status(500).json({ message: error.message});
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const ticketRef = em.getReference(Ticket, id );

    // Sanitize input specifically for update if needed (prevent changing sale, show, etc?)
    // For now, using the same sanitizer but removing IDs that shouldn't change
    const updateData = { ...req.body.sanitizedInput };
    delete updateData.ticketSaleId;
    delete updateData.showTicketId;
    delete updateData.timetableId;
    delete updateData.id; // Ensure ID is not in the assign payload

    em.assign(ticketRef, updateData);
    await em.flush();
    res.status(200).json({message: 'ticket updated'});
  } catch (error: any){
    res.status(500).json({ message: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id);
    const ticketRef = em.getReference(Ticket, id);
    await em.removeAndFlush(ticketRef);
    res.status(200).send({message: 'ticket deleted'});
  } catch (error: any){
    res.status(500).json({ message: error.message});
  }
}

export { sanitizeTicketInput, findAll, findOne, create, update, remove };