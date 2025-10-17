import { Router } from "express";
import { sanitizeTicketTypeInput, findAll, findOne, create, update, remove} from "./ticketType.controller.js";

export const ticketTypeRouter = Router()

ticketTypeRouter.get('/', findAll)
ticketTypeRouter.get('/:id', findOne)
ticketTypeRouter.post('/', sanitizeTicketTypeInput, create)
ticketTypeRouter.put('/:id',sanitizeTicketTypeInput, update)
ticketTypeRouter.patch('/:id', sanitizeTicketTypeInput, update)
ticketTypeRouter.delete('/:id', remove)

