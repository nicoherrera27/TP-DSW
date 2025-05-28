import { Router } from "express";
import { sanitizeHallInput, findAll2, findOne2, create2, update2, delete2 } from "./hall.controler.js";

export const hallRouter = Router()

hallRouter.get('/', findAll2)
hallRouter.get('/:id', findOne2)
hallRouter.post('/', sanitizeHallInput, create2)
hallRouter.put('/:id',sanitizeHallInput, update2)
hallRouter.patch('/:id', sanitizeHallInput, update2)
hallRouter.delete(':id', delete2)

