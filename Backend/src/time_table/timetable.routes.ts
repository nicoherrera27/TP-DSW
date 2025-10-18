import { Router } from "express";
import { create, remove } from "./timetable.controller.js";
import { authMiddleware, isAdmin } from "../shared/middleware/auth.js";

export const timetableRouter = Router();

// --- Rutas Protegidas (Solo Admin) ---
timetableRouter.post('/', [authMiddleware, isAdmin], create);
timetableRouter.delete('/:id', [authMiddleware, isAdmin], remove);