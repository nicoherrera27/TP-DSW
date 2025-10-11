import { ReadMore } from './ReadMore.tsx';

// Definimos un tipo más genérico para las películas
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

export function MovieGrid({ movies, basePath = '/pelicula' }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => {
        // Usamos la URL del póster directamente
        const posterUrl = movie.poster_path ? movie.poster_path : '/placeholder-movie.png';

        return (
          // El enlace ahora debería apuntar al detalle de la película en TMDB si es necesario,
          // o a una página de detalle local si la creas.
          // Por ahora, usaremos el tmdbId si existe para enlazar al detalle que ya tienes.
          <a href={`/movie/${movie.id}`} key={movie.id} className="movie-card">
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
}