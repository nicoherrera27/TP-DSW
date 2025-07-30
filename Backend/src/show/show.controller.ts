import { Request, Response } from 'express' 
import { Show } from './show.entity.js'
import { orm } from '../shared/db/schemaGenerator.js' // Adjust the import path as necessary

const em = orm.em

async function findAll(req: Request, res: Response){
  try{
    const shows = await em.find(Show,{})
    res.status(200).json({message: 'Shows found: ', data: shows})
  } 
  catch(error: any){
    res.status(500).json({message: error.message})
  }

}

async function findOne(req: Request, res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const showById = await em.findOne(Show, id)

    res.status(200).json({message: 'Show found: ', data: showById})
  }
  catch(error: any){
    res.status(500).json({message: error.message})
  }

}

async function create(req: Request, res: Response){
  try{
    const {date, state, showCat} = req.body

    const show = new Show()
    show.date = date
    show.state = state
    show.showCat = showCat

    em.persist(show)
    em.flush()

    res.status(201).json({message: 'Show created', data: show})
  } 
  catch(error: any){
    res.status(500).json({message: error.message})
  }
}

async function update(req: Request, res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const showRef = em.getReference(Show, id)
    
    em.assign(showRef, req.body)
    await em.flush()

    res.status(201).json({message: 'Show updated'})
  }
  catch(error: any){
    res.status(500).json({message: error.message})
  }
}

async function remove(req: Request, res: Response){
  try{
    const id = Number.parseInt(req.params.id)
    const showToRemove = em.getReference(Show, id)

    em.removeAndFlush(showToRemove)
    res.status(200).send({message: 'Show removed'})
  }
  catch(error: any){
    res.status(500).json({message: error.message})
  }

}

export { findAll, findOne, create, update, remove }
