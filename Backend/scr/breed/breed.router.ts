import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove 
} from "./breed.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const breedRouter = Router();

breedRouter.get('/', validateToken,findAll)
breedRouter.get('/:id',validateToken ,findOne)
breedRouter.post('/', validateToken,add)
breedRouter.put('/:id',validateToken,update)
breedRouter.delete('/:id',validateToken, remove)