import type { FC } from 'react';
import { ReadMore } from './ReadMore';

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

export const MovieGrid: FC<MovieGridProps> = ({ movies, basePath = '/movie' }) => {
  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path ? movie.poster_path : '/placeholder-movie.png';

        return (
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