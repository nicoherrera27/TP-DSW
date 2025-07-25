import { Router } from "express";  
import { sanitizeGenderInput, findAll2, create2, update2, delete2 } from "./gender.controller.js";


export const genderRouter = Router();

genderRouter.get('/', findAll2);

genderRouter.get('/:id', findAll2);

genderRouter.post('/:id', findAll2);
genderRouter.post('/', sanitizeGenderInput, create2);
genderRouter.put('/', sanitizeGenderInput, update2); 
genderRouter.patch('/', sanitizeGenderInput, update2); 
genderRouter.delete('/:id', sanitizeGenderInput, delete2);