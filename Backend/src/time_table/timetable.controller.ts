import { Request, Response } from 'express';
import { orm } from '../shared/db/orm.js';
import { Timetable } from './timetable.entity.js';
import { Show } from '../show/show.entity.js';

const em = orm.em.fork();

function timeToMinutes(timeStr: string): number {
    try {
        const [hours, minutes] = timeStr.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) {
            throw new Error('Formato de hora inválido');
        }
        return (hours * 60) + minutes;
    } catch (e) {
        console.error(`Error al parsear la hora: ${timeStr}`, e);
        return -1; 
    }
}

async function create(req: Request, res: Response) {
    try {
        const { time, showId } = req.body;
        if (!time || !showId) {
            return res.status(400).json({ message: 'Faltan datos: time y showId son requeridos.' });
        }
        const newShow = await em.findOne(Show, { id: Number(showId) }, { populate: ['showMovie', 'showRoom'] });
        
        if (!newShow) {
            return res.status(404).json({ message: 'La función (Show) especificada no existe.' });
        }
        if (!newShow.showMovie || newShow.showMovie.duration === undefined) {
            return res.status(400).json({ message: 'La película de esta función no tiene duración asignada. No se puede comprobar el conflicto.' });
        }
        if (!newShow.showRoom) {
            return res.status(400).json({ message: 'La función no tiene una sala (Room) asignada.' });
        }

        const newStartTime = timeToMinutes(time);
        if (newStartTime === -1) {
             return res.status(400).json({ message: 'Formato de hora inválido. Use "HH:MM".' });
        }
        const newEndTime = newStartTime + newShow.showMovie.duration;
        const newDate = newShow.date;
        const roomId = newShow.showRoom.id;

        const existingShowsInRoom = await em.find(Show, 
            { 
                date: newDate,     // Misma fecha
                showRoom: roomId   // Misma sala
            }, 
            { populate: ['timetables', 'showMovie'] } // Traemos sus horarios y películas
        );

        for (const existingShow of existingShowsInRoom) {
            
            const existingDuration = existingShow.showMovie?.duration;
            if (!existingDuration) continue; 

            for (const existingTimetable of existingShow.timetables) {
                const existingStartTime = timeToMinutes(existingTimetable.time);
                const existingEndTime = existingStartTime + existingDuration;

                const isOverlapping = (newStartTime < existingEndTime) && (newEndTime > existingStartTime);

                if (isOverlapping) {
                    return res.status(409).json({ 
                        message: `Conflicto de horario. La sala "${newShow.showRoom.name}" ya está ocupada en ese rango (de ${existingTimetable.time} a ${new Date(existingEndTime * 60000).toISOString().substr(11, 5)}) por la película "${existingShow.showMovie.name}".` 
                    });
                }
            }
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