import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Movie } from "./movie.entity.js";

const API_KEY = process.env.TMDB_API_KEY;

const em = orm.em;

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`; // Formato "YYYY-MM-DD"
}

function sanitizeMovieInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    duration: req.body.duration,
    synopsis: req.body.synopsis,
    id: req.body.id,
    url: req.body.url,
    genre: req.body.genre
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function importFromTmdb(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
    const { tmdbId } = req.body;

    if (!tmdbId) {
      return res.status(400).json({ message: 'El ID de TMDB es requerido' });
    }
    
    if (!API_KEY) {
      throw new Error('La clave de API de TMDB no está configurada en el servidor.');
    }

    const tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}&language=en-US`);
    if (!tmdbResponse.ok) {
      throw new Error('No se pudo obtener la información de la película desde TMDB');
    }
    const movieDetails = await tmdbResponse.json();

    const existingMovie = await em.findOne(Movie, { tmdbId: tmdbId });
    
    const movieToUpdate = existingMovie || new Movie(); 

    movieToUpdate.tmdbId = movieDetails.id;
    movieToUpdate.name = movieDetails.title || movieDetails.original_title || 'Título no disponible';
    movieToUpdate.duration = movieDetails.runtime || 0;
    movieToUpdate.synopsis = movieDetails.overview || 'Sin sinopsis disponible.';
    movieToUpdate.url = movieDetails.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
      : 'URL_POR_DEFECTO_SI_NO_HAY_POSTER';
    
    movieToUpdate.releaseDate = movieDetails.release_date;
    movieToUpdate.rating = movieDetails.vote_average || 0; 

    if (movieDetails.genres && movieDetails.genres.length > 0) {
      movieToUpdate.genre = movieDetails.genres.map((g: any) => g.name).join(', ');
    }

    if (!existingMovie) {
      em.persist(movieToUpdate);
    }
    
    await em.flush();

    const message = existingMovie ? 'Película actualizada' : 'Película importada';
    res.status(existingMovie ? 200 : 201).json({ message: `${message} correctamente`, data: movieToUpdate });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findTopRated(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
    const today = new Date(); 
    const todayString = getTodayString(); 

    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6); 
    const year = sixMonthsAgo.getFullYear();
    const month = (sixMonthsAgo.getMonth() + 1).toString().padStart(2, '0');
    const day = sixMonthsAgo.getDate().toString().padStart(2, '0');
    const sixMonthsAgoString = `${year}-${month}-${day}`;

    const movies = await em.find(Movie, 
      { 
        releaseDate: { 
          $lt: todayString,       
          $gte: sixMonthsAgoString 
        }, 
        rating: { $gt: 0 }
      }, 
      { 
        orderBy: { rating: 'DESC' }, 
        limit: 6
      }
    );
    res.status(200).json({ message: 'Películas mejor valoradas encontradas', data: movies });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findUpcoming(req: Request, res: Response) {
  const em = orm.em.fork();
  try {
    const todayString = getTodayString();
    const movies = await em.find(Movie, 
      { 
        releaseDate: { $gte: todayString } 
      }, 
      { 
        orderBy: { releaseDate: 'ASC' }, 
      }
    );
    res.status(200).json({ message: 'Próximos estrenos encontrados', data: movies });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAll (req: Request, res: Response) {
  const em = orm.em.fork();
  try{
    const movie = await em.find(Movie, {});
    res.status(200).json({message: 'find all movie', data: movie});
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' });
  }
}

async function findOne (req: Request, res: Response) {
  
  try{
    const id = Number.parseInt(req.params.id);
    const movie = await em.findOneOrFail(Movie,  id );
    res.status(200).json({message: 'found movie', data: movie});
  } catch (error: any){
    res.status(500).json({ message: error.message});
  }
}

async function create(req: Request, res: Response) {  
  const em = orm.em.fork();
  try {
    const input = req.body.sanitizedInput;

    if (input.url && input.url.includes("dropbox.com")) {
      if (input.url.includes("?dl=0")) {
        input.url = input.url.replace("?dl=0", "?raw=1");
      } else {
        input.url = input.url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
      }
    }

    const movie = em.create(Movie, input);
    await em.flush();

    res.status(201).json({ message: "movie created", data: movie });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update (req: Request, res: Response) {
  const em = orm.em.fork();
  try{
    const id = Number.parseInt(req.params.id);
    const movie = em.getReference(Movie, id );
    em.assign(movie, req.body);
    await em.flush();
    res.status(200).json({message: 'movie updated'});
  } catch (error: any){
    res.status(500).json({ message: error.message});
  }
}

async function remove(req: Request, res: Response) {
  const em = orm.em.fork();
  try{
    const id = Number.parseInt(req.params.id);
    const movie = em.getReference(Movie, id);
    await em.removeAndFlush(movie);
    res.status(200).send({message: 'movie deleted'});
  } catch (error: any){
    res.status(500).json({ message: error.message});
  }
}


export { sanitizeMovieInput, findAll, findOne, create, update, remove, importFromTmdb, findTopRated, findUpcoming };