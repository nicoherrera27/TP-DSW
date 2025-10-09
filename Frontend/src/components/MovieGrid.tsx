import { IMAGE_BASE_URL } from '../services/tmdbService';
import type { TMDBMovie } from '../types/movies';
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
          <div  key={movie.id} className="movie-card">
            {/* La imagen del póster */}
            <img
              src={posterUrl}
              alt={`Póster de ${movie.title}`}
              className="movie-card-poster"
            />
            {/* La información (título y sinopsis) va debajo de la imagen */}
            <div className="movie-card-info">
              <h3 className="font-bold text-sm ...">{movie.title}</h3>
              <ReadMore text={movie.overview ? movie.overview : 'Sin descripción disponible.'} 
                maxLength={50} />
            </div>
          </div>
        );
      })}
    </div>
  );
}