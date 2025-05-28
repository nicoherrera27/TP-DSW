import { Router } from "express"
import { user_Controller } from "./user.controller.js"

export const userRouter = Router()

userRouter.get('/', user_Controller.findAll)
userRouter.get('/:id', user_Controller.findOne)
userRouter.post('/', user_Controller.sanitizeUserInput, user_Controller.create)
userRouter.put('/:id', user_Controller.sanitizeUserInput, user_Controller.update)
userRouter.patch('/:id', user_Controller.sanitizeUserInput, user_Controller.update)
userRouter.delete(':id', user_Controller.remove)