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
    const [newShow, setNewShow] = useState({ date: getTodayString(), state: 'Available', isSpecial: false, showMovie: '', showCat: '', showRoom: '', variant: 'Dubbed' });

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
            setMessage('Error loading initial data.');
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
            return setMessage('You must select a movie, category, and room.');
        }
        try {
            const data = await api.post<{ data: Show }>('/api/show', {
                ...newShow,
                showMovie: parseInt(newShow.showMovie),
                showCat: parseInt(newShow.showCat),
                showRoom: parseInt(newShow.showRoom),
            });
            setMessage(`Show created for ${data.data.date}`);
            fetchAllData();
        } catch (error: any) {
            setMessage(`Error creating show`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Are you sure you want to delete this show?')) return;
        try {
            await api.delete(`/api/show/${id}`);
            setMessage('Show deleted successfully.');
            fetchAllData();
        } catch (error: any) {
            setMessage(`Error deleting show`);
        }
    };

    return (
        <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto' }}>
            <h2>Manage Shows</h2>
            <div style={{ padding: '1rem', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', marginBottom: '1rem', color: '#6b4f0a' }}>
                <strong>Important:</strong> To create a show, there must be a <a href="/admin/peliculas" style={{color: '#1a88c7'}}>Movie</a>, a <a href="/admin/categorias" style={{color: '#1a88c7'}}>Category</a>, and a <a href="/admin/salas" style={{color: '#1a88c7'}}>Room</a> already existing.
            </div>
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <input type="date" name="date" value={newShow.date} onChange={handleChange} required style={{ padding: '8px', color: 'black' }} min={getTodayString()}/>
                <select name="state" value={newShow.state} onChange={handleChange} style={{ padding: '8px', color: 'black' }}><option>Available</option><option>Coming Soon</option><option>Sold Out</option></select>
                <select name="variant" value={newShow.variant} onChange={handleChange} style={{ padding: '8px', color: 'black' }}><option>Dubbed</option><option>Subtitled</option></select>
                <select name="showMovie" value={newShow.showMovie} onChange={handleChange} style={{ padding: '8px', color: 'black' }}>{movies.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
                <select name="showCat" value={newShow.showCat} onChange={handleChange} style={{ padding: '8px', color: 'black' }}>{categories.map(c => <option key={c.id} value={c.id}>{c.description}</option>)}</select>
                <select name="showRoom" value={newShow.showRoom} onChange={handleChange} style={{ padding: '8px', color: 'black' }}>{rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" name="isSpecial" checked={newShow.isSpecial} onChange={handleChange} />Special</label>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a88c7', color: 'white', border: 'none', borderRadius: '4px' }}>Create Show</button>
            </form>
            {loading ? <p>Loading shows...</p> : (
                <div>
                    {shows.map((show) => (
                        <div key={show.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0', backgroundColor: show.isSpecial ? '#fffbe6' : 'transparent' }}>
                            <span><strong>{show.showMovie?.name || 'N/A'}</strong> on <strong>{show.showRoom?.name || 'N/A'}</strong> ({show.showCat?.description || 'N/A'}) - {show.date} {show.isSpecial && ' (⭐ Special)'}</span>
                            <button onClick={() => handleDelete(show.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>Delete</button>
                        </div>
                    ))}
                </div>
            )}
            {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
        </div>
    );
};
export default AdminShowPanel;