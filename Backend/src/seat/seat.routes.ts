import { Router } from "express";
import { sanitizeSeatInput, findAll, findOne, create, update, remove } from "./seat.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const seatRouter = Router();

// Rutas Públicas
seatRouter.get('/', findAll);
seatRouter.get('/:id', findOne);

// Rutas Protegidas (Solo Admin)
seatRouter.post('/', [authMiddleware, isAdmin], sanitizeSeatInput, create);
seatRouter.put('/:id', [authMiddleware, isAdmin], sanitizeSeatInput, update);
seatRouter.patch('/:id', [authMiddleware, isAdmin], sanitizeSeatInput, update);
seatRouter.delete('/:id', [authMiddleware, isAdmin], remove);