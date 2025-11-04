import { Router } from "express";
import { findAll, findForCartelera, findShowsByMovie, findOne, create, update, remove, findSpecials } from "./show.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const showRouter = Router();

// Rutas publicas
showRouter.get('/specials', findSpecials);
showRouter.get('/cartelera', findForCartelera);
showRouter.get('/by-movie/:tmdbId', findShowsByMovie);
showRouter.get('/', findAll);
showRouter.get('/:id', findOne);

// Rutas protegidas (Solo Admin)
showRouter.post('/', [authMiddleware, isAdmin], create);
showRouter.put('/:id', [authMiddleware, isAdmin], update);
showRouter.delete('/:id', [authMiddleware, isAdmin], remove);