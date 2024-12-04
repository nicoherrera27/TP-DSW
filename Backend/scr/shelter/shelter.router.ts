import { Router } from "express";
import { 
  findAll, 
  findOne, 
  add, 
  update, 
  remove, 
  sanitizeShelterInput
} from "./shelter.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const shelterRouter = Router();

shelterRouter.get('/',validateToken ,findAll)
shelterRouter.get('/:id', validateToken,findOne)
shelterRouter.post('/', validateToken, sanitizeShelterInput, add)
shelterRouter.put('/:id', validateToken, sanitizeShelterInput, update)
shelterRouter.patch('/:id', validateToken, sanitizeShelterInput, update)
shelterRouter.delete('/:id', validateToken, remove)
