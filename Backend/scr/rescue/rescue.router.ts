import { Router } from "express";
import {  findAll, findOne, add, update, remove } from "./rescue.controler.js";
import { validateToken } from "../validate-token/validate-token.routes.js";

export const rescueRouter = Router();

rescueRouter.get('/', validateToken ,findAll)
rescueRouter.get('/:id', validateToken ,findOne)
rescueRouter.post('/', validateToken , add)
rescueRouter.patch('/:id', validateToken ,update)
rescueRouter.delete('/:id', validateToken ,remove)
rescueRouter.put('/:id', validateToken ,update)
