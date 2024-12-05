import { Request, Response, NextFunction } from 'express';
import { Adoption } from './adoption.entity.js';
import { orm } from '../zshare/db/orm.js';


const em = orm.em

function sanitizeAdoptionInput(req: Request, res: Response, next:NextFunction){
  
  req.body.sanitizedAdoption = {
    comments: req.body.comments,
    animal: req.body.animal,
    person: req.body.person,
    adoption_date: req.body.adoption_date,
    id: req.body.id,
  }
  if (req.body.sanitizedAdoption){
    Object.keys(req.body.sanitizedAdoption).forEach((key) => {
      if (req.body.sanitizedAdoption[key] === undefined) {
        delete req.body.sanitizedAdoption[key]
      }
    })
  }

  next();
}

async function findAll( req: Request, res: Response ){
  try{
    const adoption = await em.find(Adoption, {});
    res.status(200).json({message: 'all adoptions: ', data: adoption});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const adoption = await em.findOneOrFail(Adoption, { id: id });
    res.status(200).json({message: 'adoption data: ', data: adoption});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function add( req: Request, res: Response ){
  try{
    const input = req.body.sanitizedAdoption;
    const adoption = em.create(Adoption, input);
    await em.flush();
    res.status(201).json({ message: 'adoption created', data: adoption });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const input = req.body.sanitizedAdoption;
    const adoption = em.getReference(Adoption, id);
    em.assign(adoption, input);
    await em.flush();
    res.status(200).json({ message: 'adoption updated', data: adoption });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const adoption = em.getReference(Adoption, id);
    em.removeAndFlush(adoption);
    res.status(200).json({ message: 'adoption deleted', data: adoption });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, sanitizeAdoptionInput }
