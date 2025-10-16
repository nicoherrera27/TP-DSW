import { Router } from "express";
import { create, remove } from "./timetable.controller.js";

export const timetableRouter = Router();

timetableRouter.post('/', create);
timetableRouter.delete('/:id', remove); // <-- AÑADIR ESTA LÍNEA