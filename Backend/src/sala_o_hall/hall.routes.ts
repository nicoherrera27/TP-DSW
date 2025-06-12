import { Router } from "express";
import { sanitizeHallInput, findAll, findOne, create, update, remove } from "./hall.controler.js";

export const hallRouter = Router()

hallRouter.get('/', findAll)
hallRouter.get('/:id', findOne)
hallRouter.post('/', sanitizeHallInput, create)
hallRouter.put('/:id',sanitizeHallInput, update)
hallRouter.patch('/:id', sanitizeHallInput, update)
hallRouter.delete('/:id', remove)

