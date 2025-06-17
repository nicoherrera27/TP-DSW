import { Router } from "express"
import { findAll, findOne, create, update, remove } from "./show.controller.js"
export const showRouter = Router()

showRouter.get('/', findAll)
showRouter.get('/:id', findOne)
showRouter.post('/',  create)
showRouter.put('/:id', update)
showRouter.delete('/:id', remove)