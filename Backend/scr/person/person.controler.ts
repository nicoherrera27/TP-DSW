import { Request, Response, NextFunction } from 'express';
import { orm } from '../zshare/db/orm.js';
import { Person } from './person.entity.js';

const em = orm.em

async function findAll( req: Request, res: Response ){
  try{
    const person = await em.find(Person, {});
    res.status(200).json({message: 'all people: ', data: person});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOne( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const person = await em.findOneOrFail(Person, { id: id });
    res.status(200).json({message: 'person data: ', data: person});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function findOneByDoc( req: Request, res: Response ){
  try {
    const { doc_type, doc_nro } = req.params;
    const id = Number.parseInt(req.params.id);
    const person = await em.findOneOrFail(Person, { doc_type: doc_type, doc_nro: doc_nro });
    res.status(200).json({message: 'person data: ', data: person});
  } catch (error: any){
    res.status(500).json({message: error.message});
  }
}

async function add( req: Request, res: Response ){
  try{
    //const input = req.body.sanitizedPerson;
    const person = em.create(Person, req.body);
    await em.flush();
    res.status(201).json({ message: 'person created', data: person });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const input = req.body.sanitizedPerson;
    const person = em.getReference(Person, id);
    em.assign(person, input);
    await em.flush();
    res.status(200).json({ message: 'person updated', data: person });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove( req: Request, res: Response ){
  try{
    const id = Number.parseInt(req.params.id);
    const person = em.getReference(Person, id);
    em.removeAndFlush(person);
    res.status(200).json({ message: 'person deleted', data: person });
  }catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function sanitizePersonInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedPerson = {
    name: req.body.name,
    surname: req.body.surname,
    doc_nro: req.body.doc_nro,
    doc_type: req.body.doc_type,
    email: req.body.email,
    phone: req.body.phone,
    birthdate: req.body.birthdate ? new Date(req.body.birthdate) : null,
    address: req.body.address,
    nroCuit: req.body.nroCuit,
  };

  if (req.body.sanitizedPerson) {
    Object.keys(req.body.sanitizedPerson).forEach((key) => {
      if (req.body.sanitizedPerson[key] === undefined) {
        delete req.body.sanitizedPerson[key];
      }
    });
  }

  next();
}

export { findAll, findOne, add, update, remove, findOneByDoc, sanitizePersonInput }
