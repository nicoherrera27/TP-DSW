import { Request, Response, NextFunction } from 'express';
import { Gender } from './gender.entity.js';


//const repository2 = new GenderRepository2 ()

function sanitizeGenderInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    name: req.body.name,
    id: req.body.id
  }

Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) 
    {delete req.body.sanitizedInput[key]
    }
  })
next()
}
async function findAll2( req:Request, res:Response) {
 res.status(500).json({message: 'not implemented'})
}

async function findOne2 (req:Request, res:Response) {
 res.status(500).json({message: 'not implemented'})
}

async function create2 ( req:Request, res:Response) {
 res.status(500).json({message: 'not implemented'})}

async function update2 ( req:Request, res:Response) {
 res.status(500).json({message: 'not implemented'})
}

async function delete2 ( req:Request, res:Response) {
 res.status(500).json({message: 'not implemented'})
}

export { sanitizeGenderInput, findAll2, findOne2, create2, update2, delete2};