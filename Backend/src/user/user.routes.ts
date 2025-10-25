import { Router } from "express";
import { create, findAll, findOne, login, remove, update } from "./user.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js"; // <-- Importar middlewares

export const userRouter = Router();

// Public routes for registration and login
userRouter.post('/register', create);
userRouter.post('/login', login);

// Protected routes below (require a valid token)
userRouter.use(authMiddleware);

// Admin-only routes (require 'admin' role)
userRouter.get('/', isAdmin, findAll);
userRouter.get('/:id', isAdmin, findOne);
userRouter.put('/:id', isAdmin, update); // <-- RUTA PROTEGIDA
userRouter.delete('/:id', isAdmin, remove);