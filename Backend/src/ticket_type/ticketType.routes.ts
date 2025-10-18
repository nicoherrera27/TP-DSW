import { Router } from "express";
import { sanitizeTicketTypeInput, findAll, findOne, create, update, remove} from "./ticketType.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const ticketTypeRouter = Router();

// Rutas Públicas
ticketTypeRouter.get('/', findAll);
ticketTypeRouter.get('/:id', findOne);

// Rutas Protegidas (Solo Admin)
ticketTypeRouter.post('/', [authMiddleware, isAdmin], sanitizeTicketTypeInput, create);
ticketTypeRouter.put('/:id', [authMiddleware, isAdmin], sanitizeTicketTypeInput, update);
ticketTypeRouter.patch('/:id', [authMiddleware, isAdmin], sanitizeTicketTypeInput, update);
ticketTypeRouter.delete('/:id', [authMiddleware, isAdmin], remove);