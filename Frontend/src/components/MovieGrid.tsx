import { IMAGE_BASE_URL } from '../services/tmdbService';
import type { TMDBMovie } from '../types/movies';

interface MovieGridProps {
  movies: TMDBMovie[];
}

//formato de cada película (2D o 3D)
const getMovieFormat = (movieId: number): '2D' | '3D' => {
  // Uso el ID de la película para saber el formato de manera consistente
  // Las películas con ID par son las 3D y las impares 2D (por conveniencia nomas)
  return movieId % 2 === 0 ? '3D' : '2D';
};

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        const format = getMovieFormat(movie.id);
        const posterUrl = movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : '/placeholder-movie.png';

        return (
          <div key={movie.id} className="movie-item">
            <div className="movie-poster-container">
              <img
                src={posterUrl}
                alt={movie.title}
                className="movie-poster"
              />
              <span className={`format-badge ${format.toLowerCase()}`}>
                {format}
              </span>
            </div>
            <div className="movie-details">
              <h3>{movie.title}</h3>
              <div className="movie-meta">
                <span className="rating">⭐{movie.vote_average.toFixed(1)}</span>
                <span className="year">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Próximamente'}
                </span>
              </div>
              <p className="synopsis">
                {movie.overview 
                  ? movie.overview.length > 150 
                    ? `${movie.overview.substring(0, 150)}...`
                    : movie.overview
                  : 'Sin descripción disponible'}
              </p>
              <button className="btn-buy-ticket">Comprar Entradas</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}