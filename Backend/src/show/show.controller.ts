import { Request, Response } from 'express' 
import { Show } from './show.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response){
  try{
    // CORRECCIÓN: Añadimos 'timetables' para que siempre se carguen los horarios
    const shows = await em.find(Show, {}, { populate: ['showMovie', 'showCat', 'showRoom', 'timetables'] });
    res.status(200).json({message: 'Todas las funciones encontradas: ', data: shows})
  } 
  catch(error: any){
    res.status(500).json({message: error.message})
  }
}

async function findForCartelera(req: Request, res: Response) {
  try {
    const { genre, format, variant } = req.query;
    const filter: any = { isSpecial: false };
    if (variant && typeof variant === 'string') {
      filter.variant = variant;
    }
    if (format && typeof format === 'string') {
      filter.showCat = { description: format };
    }
    if (genre && typeof genre === 'string') {
      filter.showMovie = { genre: { $like: `%${genre}%` } };
    }
    const shows = await em.find(Show, filter, { populate: ['showMovie', 'showCat', 'showRoom'] });
    res.status(200).json({ message: 'Funciones de cartelera encontradas', data: shows });
  } 
  catch(error: any) {
    res.status(500).json({ message: error.message });
  }
}
  
  async function findShowsByMovie(req: Request, res: Response) {
      try {
          const tmdbId = parseInt(req.params.tmdbId, 10);
          const shows = await em.find(Show,
              { showMovie: { tmdbId } },
              { populate: ['showCat', 'showRoom', 'timetables'] }
          );
          res.status(200).json({ data: shows });
      } catch (error: any) {
          res.status(500).json({ message: error.message });
      }
  }
  
  async function findOne(req: Request, res: Response){
    try{
      const id = Number.parseInt(req.params.id)
      const showById = await em.findOne(Show, id, { populate: ['showMovie', 'showCat', 'showRoom', 'timetables'] })
      res.status(200).json({message: 'Show found: ', data: showById})
    }
    catch(error: any){
      res.status(500).json({message: error.message})
    }
  }
  
  async function create(req: Request, res: Response){
    try{
      const {date, state = 'Disponible', showCat, showMovie, isSpecial = false, showRoom, variant} = req.body;
      
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const todayString = `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"

      if (date < todayString) {
      return res.status(400).json({ message: 'Error: No se pueden crear funciones en fechas pasadas.' });
      }

      const show = new Show()
      show.date = date
      show.state = state
      show.showCat = showCat
      show.showMovie = showMovie
      show.isSpecial = isSpecial
      show.showRoom = showRoom
      show.variant = variant;
  
      await em.persistAndFlush(show)
      res.status(201).json({message: 'Show created', data: show})
    }
    catch(error: any){
      res.status(500).json({message: error.message})
    }
  }
  
  async function update(req: Request, res: Response){
    try{
      const id = Number.parseInt(req.params.id)
      const showRef = em.getReference(Show, id)
      em.assign(showRef, req.body)
      await em.flush()
      res.status(201).json({message: 'Show updated'})
    }
    catch(error: any){
      res.status(500).json({message: error.message})
    }
  }
  
  async function remove(req: Request, res: Response){
    try{
      const id = Number.parseInt(req.params.id)
      const showToRemove = em.getReference(Show, id)
      await em.removeAndFlush(showToRemove)
      res.status(200).send({message: 'Show removed'})
    }
    catch(error: any){
      res.status(500).json({message: error.message})
    }
  }
  
  async function findSpecials(req: Request, res: Response) {
    try {
      const specialShows = await em.find(Show, { isSpecial: true }, { populate: ['showMovie', 'showCat', 'showRoom'] });
      res.status(200).json({ message: 'Funciones especiales encontradas', data: specialShows });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  export { findAll, findForCartelera, findShowsByMovie, findOne, create, update, remove, findSpecials }