import { Router } from "express";
import { sanitizeMovie_roomInput, findAll, findOne, create, update, remove } from "./movie_room.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const movie_roomRouter = Router();

// Rutas Públicas
movie_roomRouter.get('/', findAll);
movie_roomRouter.get('/:id', findOne);

// Rutas Protegidas (Solo Admin)
movie_roomRouter.post('/', [authMiddleware, isAdmin], sanitizeMovie_roomInput, create);
movie_roomRouter.put('/:id', [authMiddleware, isAdmin], sanitizeMovie_roomInput, update);
movie_roomRouter.patch('/:id', [authMiddleware, isAdmin], sanitizeMovie_roomInput, update);
movie_roomRouter.delete('/:id', [authMiddleware, isAdmin], remove);