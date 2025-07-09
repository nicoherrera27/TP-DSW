import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Movie_room } from "./movie_room.entity.js";
import { movie_roomRouter } from "./movie_room.routes.js";

const em = orm.em

function sanitizeMovie_roomInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    name: req.body.number,
    capacity: req.body.capacity,
     id: req.body.id
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
    const movie_room = await em.find(Movie_room, {})
    res.status(200).json({message: 'find all movie room', data: movie_room})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie_room = await em.findOneOrFail(Movie_room,  id )
    res.status(200).json({message: 'found movie room', data: movie_room})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const movie_room = em.create(Movie_room, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'movie room created', data: movie_room})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie_room = em.getReference(Movie_room, id )
    em.assign(movie_room, req.body)
    await em.flush()
    res.status(200).json({message: 'movie room updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie_room = em.getReference(Movie_room, id)
    await em.removeAndFlush(movie_room)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'movie room deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeMovie_roomInput, findAll, findOne, create, update, remove }