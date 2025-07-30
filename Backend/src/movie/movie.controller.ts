import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/schemaGenerator.js"; // Adjust the import path as necessary
import { Movie } from "./movie.entity.js";

const em = orm.em

function sanitizeMovieInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    name: req.body.name,
    duration: req.body.duration,
    synopsis: req.body.synopsis
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    // Sirve para evitar guardar campos vacíos o inválidos en la base de datos
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll (req: Request, res: Response) {
  try{
    const movie = await em.find(Movie, {}, {
      populate: ['shows']
    })
    res.status(200).json({message: 'find all movie', data: movie})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie = await em.findOneOrFail(Movie,  id )
    res.status(200).json({message: 'found movie', data: movie})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const movie = em.create(Movie, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'movie created', data: movie})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie = em.getReference(Movie, id )
    em.assign(movie, req.body)
    await em.flush()
    res.status(200).json({message: 'movie updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie = em.getReference(Movie, id)
    await em.removeAndFlush(movie)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'movie deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeMovieInput, findAll, findOne, create, update, remove }