import { Router } from "express";
import { 
  findAll, 
  findOne, 
  add, 
  update, 
  remove 
} from "./shelter.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const shelterRouter = Router();

shelterRouter.get('/',validateToken ,findAll)
shelterRouter.get('/:id', validateToken,findOne)
shelterRouter.post('/', validateToken ,add)
shelterRouter.put('/:id', validateToken ,update)
shelterRouter.patch('/:id', validateToken, update)
shelterRouter.delete('/:id', validateToken, remove)
