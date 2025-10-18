import { Router } from "express";
import { findAll, findOne, create, update, remove } from "./show_category.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const showCategoryRouter = Router();

// Rutas Públicas
showCategoryRouter.get('/', findAll);
showCategoryRouter.get('/:id', findOne);

// Rutas Protegidas (Solo Admin)
showCategoryRouter.post('/', [authMiddleware, isAdmin], create);
showCategoryRouter.put('/:id', [authMiddleware, isAdmin], update);
showCategoryRouter.delete('/:id', [authMiddleware, isAdmin], remove);