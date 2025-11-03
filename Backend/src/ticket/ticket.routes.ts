import { Router } from "express";
import { sanitizeTicketInput, findAll, findOne, create, update, remove, getSoldCountByTimetable } from "./ticket.controller.js";

export const ticketRouter = Router()

ticketRouter.get('/count/by-timetable/:timetableId', getSoldCountByTimetable);


ticketRouter.get('/', findAll)
ticketRouter.get('/:id', findOne)
ticketRouter.post('/', sanitizeTicketInput, create)
ticketRouter.put('/:id',sanitizeTicketInput, update)
ticketRouter.patch('/:id', sanitizeTicketInput, update)
ticketRouter.delete('/:id', remove)