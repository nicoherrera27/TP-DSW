import { Router } from "express";
import { findAll, findOne, add, update, remove } from "./animal.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const animalRouter = Router();

animalRouter.get('/', validateToken,findAll)
animalRouter.get('/:id', validateToken,findOne)
animalRouter.post('/',validateToken ,add)
animalRouter.put('/:id',validateToken ,update)
animalRouter.delete('/:id',validateToken ,remove)
