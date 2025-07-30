import { Request, Response } from 'express'
import { ShowCategory } from './show_category.entity.js'
import { orm } from '../shared/db/schemaGenerator.js' // Adjust the import path as necessary

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const showCategorys = await em.find(ShowCategory, {}, {
      populate: ['shows']
    })
    res.status(200).json({ message: 'Tipos de funcion encontrados: ', data: showCategorys })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }

}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const showCategoryById = await em.findOne(ShowCategory, id, {populate: ['shows']})
    res.status(200).json({ message: 'Tipo de funcion encontrado: ', data: showCategoryById })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function create(req: Request, res: Response) {
  try {
    const { description, price } = req.body

    const showcategory = new ShowCategory()
    showcategory.description = description
    showcategory.price = price

    em.persist(showcategory)
    await em.flush()

    res.status(200).json({ message: 'Tipo de funcion creado: ', data: showcategory })

  }

  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const showCategoryRef = em.getReference(ShowCategory, id)

    em.assign(showCategoryRef, req.body)
    await em.flush()

    res.status(200).send({message: 'Show category updated'})
 
  }
  catch(error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const scToRemove = await em.findOneOrFail(ShowCategory, id, {populate: ['shows']})
    await em.removeAndFlush(scToRemove)

    res.status(200).send({message: 'Show category removed'})

  }
  catch(error: any){
    res.status(500).json({ message: error.message })
  }
}


export { findAll, findOne, create, update, remove }