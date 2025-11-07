import { useState, useEffect } from 'react';
import { MovieGrid } from './MovieGrid';

// Definimos los tipos de datos que esperamos del backend
interface Movie {
  id: number;
  tmdbId: number;
  name: string;
  synopsis: string;
  url: string;
}
interface Show {
  id: number;
  showMovie: Movie;
}

export default function Billboard() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
  
  // Estado para nuestros filtros
  const [filters, setFilters] = useState({
    format: '',
    variant: '',
    genre: ''
  });

  // useEffect se ejecutará cada vez que el estado 'filters' cambie
  useEffect(() => {
    setLoading(true);
    // Construimos la URL con los parámetros de filtro
    const queryParams = new URLSearchParams();
    if (filters.format) queryParams.append('format', filters.format);
    if (filters.variant) queryParams.append('variant', filters.variant);
    if (filters.genre) queryParams.append('genre', filters.genre);

fetch(`http://localhost:3000/api/show/cartelera?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => {
        const shows: Show[] = data.data || [];
        const uniqueMovies = new Map<number, Movie>();
        shows.forEach(show => {
          if (show.showMovie && !uniqueMovies.has(show.showMovie.id)) {
            uniqueMovies.set(show.showMovie.id, show.showMovie);
          }
        });
        setMovies(Array.from(uniqueMovies.values()));
      })
      .catch(error => {
        console.error("Error al cargar la cartelera:", error);
        setMovies([]);
        })
        .finally(() => {
        setLoading(false);
      });
  }, [filters]); // array de dependencias

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Mapeamos los datos para que MovieGrid los entienda
  const moviesForGrid = movies.map(movie => ({
    id: movie.tmdbId,
    title: movie.name,
    overview: movie.synopsis,
    poster_path: movie.url,
  }));

  return (
    <>
      <header className="cartelera-header">
        <h1>Movies</h1>
        <div className="filters">
          <select name="format" value={filters.format} onChange={handleFilterChange} className="filter-select">
            <option value="">All formats</option>
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="4D">4D</option>
          </select>

          <select name="variant" value={filters.variant} onChange={handleFilterChange} className="filter-select">
            <option value="">All Versions</option>
            <option value="Doblada">Dubbed</option>
            <option value="Subtitulada">Subtitled</option>
          </select>

          <select name="genre" value={filters.genre} onChange={handleFilterChange} className="filter-select">
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Horror">Horror</option>
            <option value="Drama">Drama</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Animation">Animation</option>
            <option value="Romance">Romance</option>
          </select>
        </div>
      </header>

      <section className="movie-section">
        {loading ? (
          <p className="cartelera-message">Loading movies...</p>
        ) : moviesForGrid.length > 0 ? (
          <MovieGrid movies={moviesForGrid} />
        ) : (
          <p className="cartelera-message">No movies found with those filters.</p>
        )}
      </section>
    </>
  );
}