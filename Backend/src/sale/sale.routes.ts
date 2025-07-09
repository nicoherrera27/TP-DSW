import { Router } from "express";
import { sanitizeSaleInput, findAll, findOne, create, update, remove } from "./sale.controller.js";

export const saleRouter = Router()

saleRouter.get('/', findAll)
saleRouter.get('/:id', findOne)
saleRouter.post('/', sanitizeSaleInput, create)
saleRouter.put('/:id',sanitizeSaleInput, update)
saleRouter.patch('/:id', sanitizeSaleInput, update)
saleRouter.delete('/:id', remove)

