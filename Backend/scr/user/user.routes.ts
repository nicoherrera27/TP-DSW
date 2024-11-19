import { Router } from 'express';
import { login, newUser } from './user.controler.js';

export const userRouter = Router();

userRouter.post('/', newUser)
userRouter.post('/login', login)