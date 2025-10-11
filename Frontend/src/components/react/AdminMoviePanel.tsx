import { useState, useEffect } from 'react';
import { tmdbService } from '../../services/tmdbService';
import type { TMDBMovie } from '../../types/movies';

// Definimos un tipo para nuestras películas locales
interface LocalMovie {
  id: number;
  name: string;
  tmdbId: number;
}

const AdminMoviePanel = () => {
  // --- Estados para la búsqueda en TMDB ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TMDBMovie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // --- Estados para la lista de películas locales ---
  const [localMovies, setLocalMovies] = useState<LocalMovie[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  // --- Estado para mensajes ---
  const [message, setMessage] = useState('');

  // --- Cargar películas locales al montar el componente ---
  useEffect(() => {
    fetchLocalMovies();
  }, []);

  const fetchLocalMovies = async () => {
    setLocalLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      if (response.ok) {
        setLocalMovies(data.data);
      }
    } catch (error) {
      setMessage('❌ Error al cargar las películas de la base de datos.');
    } finally {
      setLocalLoading(false);
    }
  };

  // --- Funciones para la búsqueda e importación ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchLoading(true);
    setMessage('');
    try {
      const response = await tmdbService.searchMovies(query);
      setResults(response.results);
    } catch (error) {
      setMessage('Error al buscar películas en TMDB.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleImport = async (tmdbId: number) => {
    setMessage(`Importando película ID: ${tmdbId}...`);
    try {
      const res = await fetch('http://localhost:3000/api/movies/import-from-tmdb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Película importada: ${data.data.name}`);
        fetchLocalMovies(); // Recargar la lista de películas locales
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  // --- Nueva función para eliminar ---
  const handleDelete = async (movieId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta película de tu cartelera?')) {
      return;
    }
    setMessage(`Eliminando película ID: ${movieId}...`);
    try {
      const res = await fetch(`http://localhost:3000/api/movies/${movieId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage('✅ Película eliminada correctamente.');
        fetchLocalMovies(); // Recargar la lista tras eliminar
      } else {
        const data = await res.json();
        setMessage(`❌ Error al eliminar: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  return (
    <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
      
      {/* Columna Izquierda: Importar Películas */}
      <div>
        <h2>Importar Películas desde TMDB</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por título..." style={{ flexGrow: 1, padding: '10px', color: 'black' }}/>
          <button type="submit" disabled={searchLoading} style={{ padding: '10px 20px' }}>{searchLoading ? 'Buscando...' : 'Buscar'}</button>
        </form>
        <div>
          {results.map((movie) => (
            <div key={movie.id} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
              <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : ''} alt={movie.title} style={{ width: '50px' }}/>
              <span style={{ flexGrow: 1 }}>{movie.title}</span>
              <button onClick={() => handleImport(movie.id)}>Importar</button>
            </div>
          ))}
        </div>
      </div>

      {/* Columna Derecha: Películas en Cartelera (Base de Datos) */}
      <div>
        <h2>Películas en Cartelera</h2>
        {localLoading ? <p>Cargando...</p> : (
          <div>
            {localMovies.map((movie) => (
              <div key={movie.id} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <strong style={{ flexGrow: 1 }}>{movie.name}</strong>
                <button onClick={() => handleDelete(movie.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default AdminMoviePanel;