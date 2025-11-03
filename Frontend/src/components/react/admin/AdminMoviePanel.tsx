import { useState, useEffect } from 'react';
import { tmdbService } from '@/services/tmdbService';
import type { TMDBMovie } from '@/types/movies';
import { api } from '@/services/apiClient'; // <-- Importar nuestro nuevo cliente de API

// ... (la interfaz LocalMovie se mantiene igual)
interface LocalMovie {
    id: number;
    name: string;
    tmdbId: number;
}

const AdminMoviePanel = () => {
    // ... (los estados se mantienen igual)
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TMDBMovie[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [localMovies, setLocalMovies] = useState<LocalMovie[]>([]);
    const [localLoading, setLocalLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLocalMovies();
    }, []);

    const fetchLocalMovies = async () => {
        setLocalLoading(true);
        try {
            // Usamos api.get para la petición pública
            const data = await api.get<{ data: LocalMovie[] }>('/api/movies');
            setLocalMovies(data.data);
        } catch (error) {
            setMessage('❌ Error al cargar las películas de la base de datos.');
        } finally {
            setLocalLoading(false);
        }
    };
    
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
            const data = await api.post<{ data: { name: string } }>('/api/movies/import-from-tmdb', { tmdbId });
            setMessage(`✅ Película importada: ${data.data.name}`);
            fetchLocalMovies();
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    const handleDelete = async (movieId: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta película?')) return;
        
        setMessage(`Eliminando película ID: ${movieId}...`);
        try {
            await api.delete(`/api/movies/${movieId}`);
            setMessage('✅ Película eliminada correctamente.');
            fetchLocalMovies();
        } catch (error: any) {
            setMessage(`❌ Error al eliminar: ${error.message}`);
        }
    };
    
return (
        <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
                <h2>Importar Películas desde TMDB</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por título..." style={{ flexGrow: 1, padding: '10px', color: 'black' }} />
                    <button type="submit" disabled={searchLoading} style={{ padding: '10px 20px' }}>{searchLoading ? 'Buscando...' : 'Buscar'}</button>
                </form>
                <div>
                    {results.map((movie) => (
                        <div key={movie.id} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
                            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : ''} alt={movie.title} style={{ width: '50px' }} />
                            <span style={{ flexGrow: 1 }}>{movie.title}</span>
                            <button onClick={() => handleImport(movie.id)}>Importar</button>
                        </div>
                    ))}
                </div>
            </div>
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