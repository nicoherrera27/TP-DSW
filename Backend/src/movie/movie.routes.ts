import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, create, update, remove, importFromTmdb, findTopRated, findUpcoming } from "./movie.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js"; // <-- Importar ambos middlewares

export const movieRouter = Router();

// Rutas públicas
movieRouter.get('/top-rated', findTopRated);
movieRouter.get('/upcoming', findUpcoming);

movieRouter.get('/', findAll);
movieRouter.get('/:id', findOne);

// Rutas protegidas que ahora requieren rol de administrador
movieRouter.post('/import-from-tmdb', [authMiddleware, isAdmin], importFromTmdb); 
movieRouter.post('/', [authMiddleware, isAdmin], sanitizeMovieInput, create);
movieRouter.put('/:id', [authMiddleware, isAdmin], sanitizeMovieInput, update);
movieRouter.patch('/:id', [authMiddleware, isAdmin], sanitizeMovieInput, update);
movieRouter.delete('/:id', [authMiddleware, isAdmin], remove);