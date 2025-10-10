import { Router } from "express"
import { findAll, findOne, create, update, remove } from "./user.controller.js"

export const userRouter = Router()

userRouter.post('/register',  create)

userRouter.get('/', findAll)
userRouter.get('/:id', findOne)
userRouter.put('/:id', update)
userRouter.delete('/:id', remove)