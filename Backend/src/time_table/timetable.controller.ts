import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Timetable } from './timetable.entity.js';

const em = orm.em.fork();

async function create(req: Request, res: Response) {
    try {
        const { time, showId } = req.body;
        if (!time || !showId) {
            return res.status(400).json({ message: 'Faltan datos: time y showId son requeridos.' });
        }
        const newTimetable = em.create(Timetable, { time, show: showId });
        await em.flush();
        res.status(201).json({ message: 'Horario creado.', data: newTimetable });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function remove(req: Request, res: Response) {
    try {
        const id = Number.parseInt(req.params.id);
        const timetable = await em.findOneOrFail(Timetable, id);
        await em.removeAndFlush(timetable);
        res.status(200).json({ message: 'Horario eliminado correctamente.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export { create, remove };