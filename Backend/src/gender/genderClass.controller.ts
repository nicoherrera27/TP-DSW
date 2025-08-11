import { Request, Response } from 'express';
import { orm } from '../shared/db/orm';
import { GenderClass } from './genderClass.entity';

const em = orm.em

async function findAll2( req:Request, res:Response) {
 res.status(500).json({message: 'not implemented'})
    try
    {
        const genderClasses = await em.find(GenderClass, {})
        res.status(200).json({message: 'finded all gender classes',data: genderClasses});
    } catch (error: any) {
        res.status(500).json({message: error.message})
}
}

async function findOne2 (req:Request, res:Response) {
try{
    const id = Number.parseInt(req.params.id);
    const genderClass = await em.findOneOrFail(GenderClass, {id})
    res.status(200).json({message: 'found gender class', data:genderClass})
}
catch (error: any) {
    res.status(500).json({message: error.message})}
} 

async function create2 ( req:Request, res:Response) {
try{
   const genderClass = em.create(GenderClass, req.body)
   await em.flush()
   res.status(201).json({message: 'gender class created', data: genderClass})
} catch (error: any) {
    res.status(500).json({message: error.message})
}
}

async function update2 ( req:Request, res:Response) {
try{
    const id = Number.parseInt(req.params.id);
    const genderClass = await em.getReference(GenderClass, id)
    genderClass.name = req.body.name
    em.assign(genderClass, req.body)
    await em.flush()
    res.status(200).json({message: 'gender class updated'})
} catch (error: any) {
    res.status(200).json({message: error.message})
}
}

async function delete2 ( req:Request, res:Response) {
try{
    const id = Number.parseInt(req.params.id);
    const genderClass = await em.getReference(GenderClass, id)
    await em.removeAndFlush(genderClass)
    res.status(200).json({message: 'gender class deleted'})
} catch (error: any) {
    res.status(500).json({message: error.message})

}
}

export { findAll2, findOne2, create2, update2, delete2};