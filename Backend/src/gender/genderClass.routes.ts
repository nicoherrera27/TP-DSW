import { Router } from "express";  
import { findAll2, create2, update2, delete2 
} from "./genderClass.controller.js";


export const genderClassRouter = Router();

genderClassRouter.get('/', findAll2);

genderClassRouter.get('/:id', findAll2);

genderClassRouter.post('/:id', findAll2);
genderClassRouter.post('/', create2);
genderClassRouter.put('/', update2); 
genderClassRouter.delete('/:id', delete2);