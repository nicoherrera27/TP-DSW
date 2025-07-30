import { Router } from "express";  
import { gender_Controller } from "./gender.controller.js";


export const genderRouter = Router();

genderRouter.get('/', gender_Controller.findAll2);

genderRouter.get('/:id', gender_Controller.findAll2);

genderRouter.post('/:id', gender_Controller.findAll2);
genderRouter.post('/', gender_Controller.sanitizeGenderInput, gender_Controller.create2);
genderRouter.put('/', gender_Controller.sanitizeGenderInput, gender_Controller.update2); 
genderRouter.patch('/', gender_Controller.sanitizeGenderInput, gender_Controller.update2); 
genderRouter.delete('/:id', gender_Controller.sanitizeGenderInput, gender_Controller.delete2);