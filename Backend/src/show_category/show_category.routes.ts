import { Router } from "express"
import { findAll, findOne, create, update, remove } from "./show_category.controller.js"

export const showCategoryRouter = Router()

showCategoryRouter.get('/', findAll)
showCategoryRouter.get('/:id', findOne)
showCategoryRouter.post('/',  create)
showCategoryRouter.put('/:id', update)
showCategoryRouter.delete('/:id', remove)