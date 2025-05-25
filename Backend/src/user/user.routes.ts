import { Router } from "express"
import { findAll, findOne, create, update, remove } from "./user.controller.js"

export const userRouter = Router()

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.post('/',  create)
userRouter.put('/:id', update)
userRouter.patch('/:id', update)
userRouter.delete(':id', remove)