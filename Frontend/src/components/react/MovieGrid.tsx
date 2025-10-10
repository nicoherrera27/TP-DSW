import { IMAGE_BASE_URL } from '../../services/tmdbService.ts';
import type { TMDBMovie } from '../../types/movies.ts';
import { ReadMore } from './ReadMore.tsx';

interface MovieGridProps {
  movies: TMDBMovie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : '/placeholder-movie.png';

        return (
          <div key={movie.id} className="movie-card">
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
          </div>
        );
      })}
    </div>
  );
}