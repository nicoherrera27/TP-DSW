import { Request, Response, NextFunction } from "express";
import { orm } from "../shared/db/orm.js";
import { Movie } from "./movie.entity.js";
import { movieRouter } from "./movie.routes.js";
import { url } from "inspector";

const API_KEY = '4c13d79da36a97c80e70be9f823eb0ac';

const em = orm.em

function sanitizeMovieInput(req: Request, res: Response, next: NextFunction) {
  // Aca se realizarian las validaciones //
  req.body.sanitizedInput = {
    name: req.body.name,
    duration: req.body.duration,
    synopsis: req.body.synopsis,
    id: req.body.id,
    url: req.body.url,
    genre: req.body.genre
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    // Sirve para evitar guardar campos vacíos o inválidos en la base de datos
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}
async function importFromTmdb(req: Request, res: Response) {
  try {
    const { tmdbId } = req.body;

    if (!tmdbId) {
      return res.status(400).json({ message: 'El ID de TMDB es requerido' });
    }

    const existingMovie = await em.findOne(Movie, { tmdbId: tmdbId });
    if (existingMovie) {
      return res.status(409).json({ message: 'Esta película ya ha sido importada' });
    }

    const tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${API_KEY}&language=es-MX`);
    if (!tmdbResponse.ok) {
      throw new Error('No se pudo obtener la información de la película desde TMDB');
    }
    const movieDetails = await tmdbResponse.json();

    const newMovie = new Movie();
    newMovie.tmdbId = movieDetails.id;
    // CORRECCIÓN: Añadimos fallbacks para el nombre y la sinopsis
    newMovie.name = movieDetails.title || movieDetails.original_title || 'Título no disponible';
    newMovie.duration = movieDetails.runtime || 0;
    newMovie.synopsis = movieDetails.overview || 'Sin sinopsis disponible.';
    newMovie.url = movieDetails.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
      : 'URL_POR_DEFECTO_SI_NO_HAY_POSTER';

    if (movieDetails.genres && movieDetails.genres.length > 0) {
      newMovie.genre = movieDetails.genres.map((g: any) => g.name).join(', ');
    }

    await em.persistAndFlush(newMovie);

    res.status(201).json({ message: 'Película importada correctamente', data: newMovie });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}



async function findAll (req: Request, res: Response) {
  try{
    const movie = await em.find(Movie, {})
    res.status(200).json({message: 'find all movie', data: movie})
  } catch (error: any){
    res.status(500).json({ message:'Not implemented' })
  }
}

async function findOne (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie = await em.findOneOrFail(Movie,  id )
    res.status(200).json({message: 'found movie', data: movie})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}


/*async function create (req: Request, res: Response) {  
  try{

     const input = req.body.sanitizedInput;

    // Si la URL es de Google Drive, convertirla a formato directo
    if (input.url) {
      const driveMatch = input.url.match(/\/file\/d\/([^/]+)\//);
      if (driveMatch && driveMatch[1]) {
        const fileId = driveMatch[1];
        input.url = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }

    const movie = em.create(Movie, input) //await no es necesario aca porque es una operacion sincronica
    await em.flush() //flush es una op asincronica por eso el await aca
    res.status(201).json({ message: 'movie created', data: movie})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}*/
async function create(req: Request, res: Response) {  
  try {
    const input = req.body.sanitizedInput;

    // Si la URL es de Dropbox, convertirla a formato directo
    if (input.url && input.url.includes("dropbox.com")) {
      // Si tiene ?dl=0, cambiarlo por ?raw=1
      if (input.url.includes("?dl=0")) {
        input.url = input.url.replace("?dl=0", "?raw=1");
      } 
      // Opción alternativa: usar el dominio dl.dropboxusercontent.com
      else {
        input.url = input.url.replace("www.dropbox.com", "dl.dropboxusercontent.com");
      }
    }

    const movie = em.create(Movie, input)
    await em.flush();

    res.status(201).json({ message: "movie created", data: movie });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update (req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie = em.getReference(Movie, id )
    em.assign(movie, req.body)
    await em.flush()
    res.status(200).json({message: 'movie updated'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

async function remove(req: Request, res: Response) {
  try{
    const id = Number.parseInt(req.params.id)
    const movie = em.getReference(Movie, id)
    await em.removeAndFlush(movie)
    //em.nativeDelete(Screening_room, {id}) este es un delete mas poderoso, se usa en operaciones importantes pero no tiene informacion de lo que borra (tener cuidado al usarlo)
    res.status(200).send({message: 'movie deleted'})
  } catch (error: any){
    res.status(500).json({ message: error.message})
  }
}

export { sanitizeMovieInput, findAll, findOne, create, update, remove, importFromTmdb }