import { Router } from "express";
import {
  findAll,
  findOne,
  add,
  update,
  remove,
  findOneByDoc,
  sanitizePersonInput
} from "./person.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const personRouter = Router();

personRouter.get('/',validateToken ,findAll)
personRouter.get('/:id',validateToken, findOne)
personRouter.get('/:doc_type/:doc_nro', validateToken,sanitizePersonInput, findOneByDoc)
personRouter.post('/', validateToken,sanitizePersonInput, add)
personRouter.put('/:id',validateToken, sanitizePersonInput, update)
personRouter.delete('/:id', validateToken,sanitizePersonInput, remove)
