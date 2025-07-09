import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Sale } from "./sale.entity.js";
import { saleRouter } from "./sale.routes.js";

const em = orm.em

function sanitizeSaleInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    amount: req.body.amount,
    dateTime: req.body.date_and_time,
    total_price: req.body.total_price,
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
    const sale = await em.find(Sale, {})
    res.status(200).json({message: 'find all sale', data: sale})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const sale = await em.findOneOrFail(Sale,  id )
    res.status(200).json({message: 'found sale', data: sale})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


async function create (req: Request, res: Response) {  
  try{
    const sale = em.create(Sale, req.body.sanitizedInput) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'sale created', data: sale})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const sale = em.getReference(Sale, id )
    em.assign(sale, req.body)
    await em.flush()
    res.status(200).json({message: 'sale updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const sale = em.getReference(Sale, id)
    await em.removeAndFlush(sale)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'sale deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeSaleInput, findAll, findOne, create, update, remove }