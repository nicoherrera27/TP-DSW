import {Request, Response} from 'express'
import bcrypt from 'bcrypt'; 
import { User } from './user.entity.js';
import { orm } from '../zshare/db/orm.js';
import jwt from 'jsonwebtoken';

export const newUser = async(req: Request, res: Response) => {
  const em = orm.em
  const {username, password} = req.body;
    // Validamos si el usuario ya existe en la base de datos
  const user = await em.findOne(User, { username: username } );

  if(user) {
       return res.status(400).json({
        msg: `Ya existe un usuario con el nombre ${username}`
    })
} 

  const hashedpassword = await bcrypt.hash(password, 10);
  console.log(hashedpassword);
  try{
    //validamos
    
    const user = await em.create(User, {
        username,
        password: hashedpassword
      });
      await em.flush();
    

    res.json({
      msg: `Usuario ${username} creado exitosamente!`
    })
  } catch (error) {
      res.status(400).json({
      msg: 'Upps ocurrio un error',
      error   
    })
  }
}
export const login = async(req: Request, res: Response) => {
  const em = orm.em
  const {username, password} = req.body;
  //validamos si el usuario ya existe en la base de datos
  const user = await em.findOne(User, { username: username } );

  if(!user) {
    return res.status(400).json({
        msg: `No existe un usuario con el nombre ${username} en la base datos`
    })
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  console.log(passwordValid);
  
     if(!passwordValid) {
    return res.status(400).json({
        msg: `Password Incorrecta`
    })
   }

     // Generamos token
   const token = jwt.sign({
    username: username
   }, process.env.SECRET_KEY || 'pepito123');
   
   res.json(token);
}