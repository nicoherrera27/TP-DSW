import { Router } from "express";
import { create, findAll, findOne, login, remove, update } from "./user.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js"; 

export const userRouter = Router();

// Rutas Publicas
userRouter.post('/register', create);
userRouter.post('/login', login);


userRouter.use(authMiddleware);

// Rutas Protegidas (solo admin)
userRouter.get('/', isAdmin, findAll);
userRouter.get('/:id', isAdmin, findOne);
userRouter.put('/:id', isAdmin, update); 
userRouter.delete('/:id', isAdmin, remove);