import type { FC } from 'react'; // 1. Importar FC (Functional Component)
import { ReadMore } from './ReadMore.tsx';

interface Movie {
  id: number | string;
  title: string;
  overview: string;
  poster_path: string | null;
}

interface MovieGridProps {
  movies: Movie[];
  basePath?: string;
}

// 2. Cambiar la definición a una constante tipada con FC
export const MovieGrid: FC<MovieGridProps> = ({ movies, basePath = '/movie' }) => {
  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path ? movie.poster_path : '/placeholder-movie.png';

        return (
          // 3. Usar la variable basePath para construir el enlace dinámicamente
          <a href={`${basePath}/${movie.id}`} key={movie.id} className="movie-card">
            <img
              src={posterUrl}
              alt={`Póster de ${movie.title}`}
              className="movie-card-poster"
            />
            <div className="movie-card-info">
              <h3>{movie.title}</h3>
              <ReadMore 
                text={movie.overview || 'Sin descripción disponible.'} 
                maxLength={50} 
              />
            </div>
          </a>
        );
      })}
    </div>
  );
};