import { Router } from "express";
import { sanitizeMovie_roomInput, findAll, findOne, create, update, remove } from "./movie_room.controller.js";

export const movie_roomRouter = Router()

movie_roomRouter.get('/', findAll)
movie_roomRouter.get('/:id', findOne)
movie_roomRouter.post('/', sanitizeMovie_roomInput, create)
movie_roomRouter.put('/:id',sanitizeMovie_roomInput, update)
movie_roomRouter.patch('/:id', sanitizeMovie_roomInput, update)
movie_roomRouter.delete('/:id', remove)

