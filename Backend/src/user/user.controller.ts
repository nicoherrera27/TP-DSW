import { Request, Response } from 'express'
import { User } from './user.entity.js'
import { orm } from '../shared/db/orm.js'
import bcrypt from 'bcrypt'

const em = orm.em

async function findAll (req: Request, res: Response) {
  try{
    const users = await em.find(User, {})
    res.status(200).json({message: 'Users found', data: users})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)

    const userById = await em.findOne(User, id )
    res.status(200).json({message: 'User found', data: userById})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function create (req: Request, res: Response) {
  try {
    const { username, password, name, surname, email, birthdate } = req.body

    const existingEmail = await em.findOne(User, {email})
     if(existingEmail){
      res.status(400).json({message : 'Email existente'})
    }

    const existingUser = await em.findOne(User, {username})
    if (existingUser){
      res.status(400).json({message : 'Usuario existente'})
    }

    const hashedPswd = await bcrypt.hash(password,10)

    const user = new User()
    user.username = username
    user.password = hashedPswd
    user.name = name
    user.surname = surname
    user.email = email
    user.birthdate = birthdate

    em.persist(user)
    await em.flush()

    res.status(201).json({ message: 'User created', data: user })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const userRef = em.getReference (User, id )

    em.assign(userRef, req.body)
    await em.flush()
    res.status(201).send({ message: 'User updated'})
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
  
}

async function remove (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const userToRemove = em.getReference(User, id)
    await em.removeAndFlush(userToRemove)
    res.status(200).send({ message: 'User removed' })
  }
  catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export  { findAll, findOne, create, update, remove }