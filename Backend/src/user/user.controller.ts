import { Request, Response } from 'express';
import { User } from './user.entity.js';
import { orm } from '../shared/db/orm.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const em = orm.em;
const JWT_SECRET = process.env.JWT_SECRET;

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
      
      const date = new Date(birthdate);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      user.birthdate = date
  
      em.persist(user)
      await em.flush()
  
      res.status(201).json({ message: 'User created', data: user })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
}

async function login(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET no está definido en las variables de entorno.');
        }

        const user = await em.findOne(User, { username });
        if (!user) {
            return res.status(401).json({ message: 'Usuario o Contraseña incorrecta' });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ message: 'Usuario o Contraseña incorrecta' });
        }
        const tokenPayload = {
            id: user.id,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });

        res.status(200).json({ message: 'Usuario autenticado correctamente', data: { token } });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
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

export { findAll, findOne, create, update, remove, login };