import { Router } from "express";
import { sanitizeSaleInput, findAll, findOne, create, update, remove, createPreference, handleWebhook } from "./sale.controller.js";
import { authMiddleware } from "../shared/middleware/auth.js";

export const saleRouter = Router()


// Endpoint para crear la preferencia de pago (protegido)
// Podrías quitar authMiddleware si permites compras sin login,
// pero igual necesitarías identificar la compra de alguna manera
saleRouter.post('/create-preference', authMiddleware, createPreference);

// Endpoint para recibir notificaciones de Mercado Pago (público)
saleRouter.post('/webhook', handleWebhook);

saleRouter.get('/', findAll)
saleRouter.get('/:id', findOne)
saleRouter.post('/', sanitizeSaleInput, create)
saleRouter.put('/:id',sanitizeSaleInput, update)
saleRouter.patch('/:id', sanitizeSaleInput, update)
saleRouter.delete('/:id', remove)

