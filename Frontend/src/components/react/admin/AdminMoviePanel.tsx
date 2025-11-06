import { useState, useEffect } from 'react';
import { tmdbService } from '@/services/tmdbService';
import type { TMDBMovie } from '@/types/movies';
import { api } from '@/services/apiClient';
interface LocalMovie {
    id: number;
    name: string;
    tmdbId: number;
}

const AdminMoviePanel = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<TMDBMovie[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [localMovies, setLocalMovies] = useState<LocalMovie[]>([]);
    const [localLoading, setLocalLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLocalMovies();
    }, []);

    // Trae las peliculas de la bbdd para mostrarlas en el panel
    const fetchLocalMovies = async () => {
        setLocalLoading(true);
        try {
            const data = await api.get<{ data: LocalMovie[] }>('/api/movies');
            setLocalMovies(data.data);
        } catch (error) {
            setMessage('Error loading movies from the database.');
        } finally {
            setLocalLoading(false);
        }
    };
    
    // Trae las peliculas de tmdb segun la busqueda
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setSearchLoading(true);
        setMessage('');
        try {
          const response = await tmdbService.searchMovies(query);
          setResults(response.results);
        } catch (error) {
          setMessage('Error searching movies on TMDB.');
        } finally {
          setSearchLoading(false);
        }
    };

    // Importa una pelicula desde tmdb a la bbdd local
    const handleImport = async (tmdbId: number) => {
        setMessage(`Importing movie ID: ${tmdbId}...`);
        try {
            const data = await api.post<{ data: { name: string } }>('/api/movies/import-from-tmdb', { tmdbId });
            setMessage(`Movie imported: ${data.data.name}`);
            fetchLocalMovies();
        } catch (error: any) {
            setMessage(`Error importing movie`);
        }
    };

    // Elimina una pelicula de la bbdd local
    const handleDelete = async (movieId: number) => {
        if (!confirm('¿Are you sure you want to delete this movie?')) return;

        setMessage(`Deleting movie ID: ${movieId}...`);
        try {
            await api.delete(`/api/movies/${movieId}`);
            setMessage('Movie deleted successfully.');
            fetchLocalMovies();
        } catch (error: any) {
            setMessage(`Error deleting movie`);
        }
    };

return (
        <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
                <h2>Import movies from TMDB</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title..." style={{ flexGrow: 1, padding: '10px', color: 'black' }} />
                    <button type="submit" disabled={searchLoading} style={{ padding: '10px 20px' }}>{searchLoading ? 'Searching...' : 'Search'}</button>
                </form>
                <div>
                    {results.map((movie) => (
                        <div key={movie.id} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
                            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : ''} alt={movie.title} style={{ width: '50px' }} />
                            <span style={{ flexGrow: 1 }}>{movie.title}</span>
                            <button onClick={() => handleImport(movie.id)}>Import</button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h2>Movies in Theaters</h2>
                {localLoading ? <p>Loading...</p> : (
                    <div>
                        {localMovies.map((movie) => (
                            <div key={movie.id} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <strong style={{ flexGrow: 1 }}>{movie.name}</strong>
                                <button onClick={() => handleDelete(movie.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete</button>
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