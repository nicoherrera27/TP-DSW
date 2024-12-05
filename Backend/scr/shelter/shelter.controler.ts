import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Shelter } from './shelter.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const shelter = await em.find(Shelter, {}, {populate:['rescues', 'zone', 'vet']});
    res.status(200).json({message: 'all shelters: ', data: shelter });
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try {
    const id = Number.parseInt(req.params.id)
    const shelter = await em.findOneOrFail(Shelter, { id }, {populate:['rescues', 'zone', 'vet']})
    res
      .status(200)
      .json({ message: 'found shelter', data: shelter })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const shelter = em.create(Shelter, req.body.sanitizedShelter)
    await em.flush()
    res.status(201).json({ message: 'Shelter created', data: shelter })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const shelter = em.getReference(Shelter, id)
    em.assign(shelter, req.body.sanitizedShelter)
    await em.flush()
    res.status(200).json({ message: 'shelter updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const shelter = em.getReference(Shelter, id)
    await em.removeAndFlush(shelter)
    res.status(200).send({ message: 'character class deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function sanitizeShelterInput(req: Request, res: Response, next:NextFunction){
  req.body.sanitizedShelter = {
    name: req.body.name,
    address: req.body.address,
    max_capacity: req.body.max_capacity,
    zone: req.body.zone.id,
    vet: req.body.vet.id,
    rescues: req.body.rescues
  }
    Object.keys(req.body.sanitizedShelter).forEach((key) => {
    if (req.body.sanitizedShelter[key] === undefined) {
      delete req.body.sanitizedShelter[key]
    }
  })

  next()
}

export { findAll, findOne, add, update, remove, sanitizeShelterInput }
