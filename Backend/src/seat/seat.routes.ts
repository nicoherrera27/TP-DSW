import { Router } from "express";
import { sanitizeSeatInput, findAll, findOne, create, update, remove } from "./seat.controller.js";

export const seatRouter = Router()

seatRouter.get('/', findAll)
seatRouter.get('/:id', findOne)
seatRouter.post('/', sanitizeSeatInput, create)
seatRouter.put('/:id',sanitizeSeatInput, update)
seatRouter.patch('/:id', sanitizeSeatInput, update)
seatRouter.delete('/:id', remove)

