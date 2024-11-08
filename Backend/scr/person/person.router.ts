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

export const personRouter = Router();

personRouter.get('/', findAll)
personRouter.get('/:id', findOne)
personRouter.get('/:doc_type/:doc_nro', sanitizePersonInput, findOneByDoc)
personRouter.post('/', sanitizePersonInput, add)
personRouter.put('/:id', sanitizePersonInput, update)
personRouter.delete('/:id', sanitizePersonInput, remove)
