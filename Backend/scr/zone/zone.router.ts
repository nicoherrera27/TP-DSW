import { Router } from "express";
import { 
  sanitizeZoneInput, 
  findAll, 
  findOne, 
  add, 
  update, 
  remove 
} from "./zone.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const zoneRouter = Router();

zoneRouter.get('/',validateToken, findAll)
zoneRouter.get('/:id',validateToken, findOne)
zoneRouter.post('/', validateToken,sanitizeZoneInput, add)
zoneRouter.put('/:id',validateToken, sanitizeZoneInput, update)
zoneRouter.patch('/:id',validateToken, sanitizeZoneInput, update)
zoneRouter.delete('/:id',validateToken, sanitizeZoneInput, remove)