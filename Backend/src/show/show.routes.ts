import { Router } from "express";
import { 
    findAll, 
    findForCartelera, 
    findShowsByMovie, 
    findOne, 
    create, 
    update, 
    remove, 
    findSpecials 
} from "./show.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const showRouter = Router();

// --- Rutas Públicas (para visualización) ---
showRouter.get('/specials', findSpecials);
showRouter.get('/cartelera', findForCartelera);
showRouter.get('/by-movie/:tmdbId', findShowsByMovie);
showRouter.get('/', findAll); // Usado por el admin para listar, pero no modifica datos
showRouter.get('/:id', findOne);

// --- Rutas Protegidas (Solo Admin) ---
showRouter.post('/', [authMiddleware, isAdmin], create);
showRouter.put('/:id', [authMiddleware, isAdmin], update);
showRouter.delete('/:id', [authMiddleware, isAdmin], remove);