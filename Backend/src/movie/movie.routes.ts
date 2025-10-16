import { Router } from "express";
import { sanitizeMovieInput, findAll, findOne, create, update, remove, importFromTmdb } from "./movie.controller.js";

export const movieRouter = Router()

movieRouter.post('/import-from-tmdb', importFromTmdb); 

movieRouter.get('/', findAll)
movieRouter.get('/:id', findOne)
movieRouter.post('/', sanitizeMovieInput, create)
movieRouter.put('/:id',sanitizeMovieInput, update)
movieRouter.patch('/:id', sanitizeMovieInput, update)
movieRouter.delete('/:id', remove)
