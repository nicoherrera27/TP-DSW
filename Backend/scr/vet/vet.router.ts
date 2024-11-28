import { Router } from "express";
import {sanitizeVet,findAll, findOne, add, update, remove } from "./vet.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const vetRouter = Router();

vetRouter.get('/',validateToken, findAll)
vetRouter.get('/:id',validateToken, findOne)
vetRouter.post('/',validateToken, sanitizeVet, add)
vetRouter.put('/:id',validateToken, sanitizeVet,  update)
vetRouter.delete('/:id',validateToken, sanitizeVet ,remove)


