import { Router } from "express";
import { authMiddleware } from "../shared/middleware/auth.js";
import { sanitizeSaleInput, findAll, findOne, create, update, remove, createSimulatedSale } from "./sale.controller.js";

export const saleRouter = Router()

saleRouter.get('/', findAll)
saleRouter.get('/:id', findOne)
saleRouter.post('/', sanitizeSaleInput, create)
saleRouter.put('/:id',sanitizeSaleInput, update)
saleRouter.patch('/:id', sanitizeSaleInput, update)
saleRouter.delete('/:id', remove)

saleRouter.post('/create-sale-simulated', authMiddleware,createSimulatedSale);

