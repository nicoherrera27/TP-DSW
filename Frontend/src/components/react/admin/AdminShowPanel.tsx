import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

interface Show { id: number; date: string; state: string; isSpecial: boolean; showMovie?: { id: number; name: string; }; showCat?: { id: number; description: string; }; showRoom?: { id: number; name: string; }; }
interface Movie { id: number; name: string; }
interface ShowCategory { id: number; description: string; }
interface MovieRoom { id: number; name: string; }
const getTodayString = () => new Date().toISOString().split('T')[0];

const AdminShowPanel = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [categories, setCategories] = useState<ShowCategory[]>([]);
    const [rooms, setRooms] = useState<MovieRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [newShow, setNewShow] = useState({ date: getTodayString(), state: 'Disponible', isSpecial: false, showMovie: '', showCat: '', showRoom: '', variant: 'Doblada' });

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [moviesRes, categoriesRes, roomsRes, showsRes] = await Promise.all([
                api.get<{ data: Movie[] }>('/api/movies'),
                api.get<{ data: ShowCategory[] }>('/api/showCategory'),
                api.get<{ data: MovieRoom[] }>('/api/halls'),
                api.get<{ data: Show[] }>('/api/show')
            ]);
            setMovies(moviesRes.data || []);
            setCategories(categoriesRes.data || []);
            setRooms(roomsRes.data || []);
            setShows(showsRes.data || []);
            if (moviesRes.data?.length > 0) setNewShow(prev => ({ ...prev, showMovie: moviesRes.data[0].id.toString() }));
            if (categoriesRes.data?.length > 0) setNewShow(prev => ({ ...prev, showCat: categoriesRes.data[0].id.toString() }));
            if (roomsRes.data?.length > 0) setNewShow(prev => ({ ...prev, showRoom: roomsRes.data[0].id.toString() }));
        } catch (error) {
            setMessage('❌ Error al cargar datos iniciales.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setNewShow(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newShow.showMovie || !newShow.showCat || !newShow.showRoom) {
            return setMessage('❌ Debes seleccionar película, categoría y sala.');
        }
        try {
            const data = await api.post<{ data: Show }>('/api/show', {
                ...newShow,
                showMovie: parseInt(newShow.showMovie),
                showCat: parseInt(newShow.showCat),
                showRoom: parseInt(newShow.showRoom),
            });
            setMessage(`✅ Función creada para el ${data.data.date}`);
            fetchAllData();
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar esta función?')) return;
        try {
            await api.delete(`/api/show/${id}`);
            setMessage('✅ Función eliminada.');
            fetchAllData();
        } catch (error: any) {
            setMessage(`❌ Error al eliminar: ${error.message}`);
        }
    };

    return (
        <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto' }}>
            <h2>Gestionar Funciones</h2>
            <div style={{ padding: '1rem', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', marginBottom: '1rem', color: '#6b4f0a' }}>
                <strong>Importante:</strong> Para crear una función, deben existir previamente una <a href="/admin/peliculas" style={{color: '#1a88c7'}}>Película</a>, una <a href="/admin/categorias" style={{color: '#1a88c7'}}>Categoría</a> y una <a href="/admin/salas" style={{color: '#1a88c7'}}>Sala</a>.
            </div>
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <input type="date" name="date" value={newShow.date} onChange={handleChange} required style={{ padding: '8px', color: 'black' }} min={getTodayString()}/>
                <select name="state" value={newShow.state} onChange={handleChange} style={{ padding: '8px', color: 'black' }}><option>Disponible</option><option>Próximamente</option><option>Agotada</option></select>
                <select name="variant" value={newShow.variant} onChange={handleChange} style={{ padding: '8px', color: 'black' }}><option>Doblada</option><option>Subtitulada</option></select>
                <select name="showMovie" value={newShow.showMovie} onChange={handleChange} style={{ padding: '8px', color: 'black' }}>{movies.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                <select name="showCat" value={newShow.showCat} onChange={handleChange} style={{ padding: '8px', color: 'black' }}>{categories.map(c => <option key={c.id} value={c.id}>{c.description}</option>)}</select>
                <select name="showRoom" value={newShow.showRoom} onChange={handleChange} style={{ padding: '8px', color: 'black' }}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" name="isSpecial" checked={newShow.isSpecial} onChange={handleChange} />Especial</label>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a88c7', color: 'white', border: 'none', borderRadius: '4px' }}>Crear Función</button>
            </form>
            {loading ? <p>Cargando funciones...</p> : (
                <div>
                    {shows.map((show) => (
                        <div key={show.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0', backgroundColor: show.isSpecial ? '#fffbe6' : 'transparent' }}>
                            <span><strong>{show.showMovie?.name || 'N/A'}</strong> en <strong>{show.showRoom?.name || 'N/A'}</strong> ({show.showCat?.description || 'N/A'}) - {show.date} {show.isSpecial && ' (⭐ Especial)'}</span>
                            <button onClick={() => handleDelete(show.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>Eliminar</button>
                        </div>
                    ))}
                </div>
            )}
            {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
};
export default AdminShowPanel;