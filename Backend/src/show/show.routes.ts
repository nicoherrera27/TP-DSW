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

export const showRouter = Router();

// Rutas más específicas primero
showRouter.get('/specials', findSpecials);
showRouter.get('/cartelera', findForCartelera);
showRouter.get('/by-movie/:tmdbId', findShowsByMovie);

// Rutas para la colección principal
showRouter.get('/', findAll);
showRouter.post('/', create);

// Rutas para un recurso específico (por ID)
showRouter.get('/:id', findOne);
showRouter.put('/:id', update);
showRouter.delete('/:id', remove); // <-- Ahora sí funcionará