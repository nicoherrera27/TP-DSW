import { useState, useEffect } from 'react';

// Interfaces
interface Timetable {
  id: number;
  time: string;
}
interface Show { 
  id: number; 
  date: string; 
  variant?: string;
  showMovie?: { name: string }; 
  showRoom?: { name: string };
  timetables: Timetable[];
}

const AdminTimetablePanel = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTime, setNewTime] = useState({ time: '', showId: '' });
    const [message, setMessage] = useState('');

    const fetchShowsAndTimetables = () => {
        setLoading(true);
        fetch('http://localhost:3000/api/show')
            .then(res => {
                if (!res.ok) throw new Error('Respuesta del servidor no fue exitosa');
                return res.json();
            })
            .then(data => {
                const showsWithData = data.data || [];
                setShows(showsWithData);
                if (showsWithData.length > 0 && !newTime.showId) {
                    setNewTime(prev => ({ ...prev, showId: showsWithData[0].id.toString() }));
                }
            })
            .catch(() => setMessage('❌ Error al cargar las funciones.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchShowsAndTimetables();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTime(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('http://localhost:3000/api/timetables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    time: newTime.time,
                    showId: parseInt(newTime.showId)
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`✅ Horario ${data.data.time.substring(0,5)} añadido.`);
                setNewTime(prev => ({ ...prev, time: '' }));
                fetchShowsAndTimetables();
            } else {
                setMessage(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            setMessage('❌ Error de conexión.');
        }
    };

    const handleDelete = async (timetableId: number) => {
        if (!confirm('¿Seguro que quieres eliminar este horario?')) return;
        setMessage('');
        try {
            const res = await fetch(`http://localhost:3000/api/timetables/${timetableId}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage('✅ Horario eliminado.');
                fetchShowsAndTimetables();
            } else {
                const data = await res.json();
                setMessage(`❌ Error al eliminar: ${data.message}`);
            }
        } catch (error) {
            setMessage('❌ Error de conexión.');
        }
    };

    return (
        <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
            <h2>Gestionar Horarios de Funciones</h2>
            <div style={{ padding: '1rem', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', marginBottom: '1rem', color: '#6b4f0a' }}>
                <strong>Importante:</strong> Para añadir un horario, primero debe existir una <a href="/admin/funciones" style={{color: '#1a88c7', textDecoration: 'underline'}}>Función</a>.
            </div>

            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <select name="showId" value={newTime.showId} onChange={handleChange} required style={{ padding: '10px', color: 'black', flexGrow: 1 }}>
                    {shows.map(show => (
                        <option key={show.id} value={show.id}>
                            {show.showMovie?.name || 'Película desconocida'} - {show.showRoom?.name || 'Sala desconocida'} ({show.variant} - {show.date})
                        </option>
                    ))}
                </select>
                <input type="time" name="time" value={newTime.time} onChange={handleChange} required style={{ padding: '10px', color: 'black' }} />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a88c7', color: 'white', border: 'none', borderRadius: '4px' }}>Añadir Horario</button>
            </form>

            {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}

            <h3>Horarios Existentes</h3>
            {loading ? <p>Cargando horarios...</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {shows.filter(s => s.timetables && s.timetables.length > 0).map(show => (
                        <div key={show.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                            <strong>{show.showMovie?.name || 'Película desconocida'} - {show.showRoom?.name || 'Sala desconocida'} ({show.variant} - {show.date})</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                {show.timetables.map(tt => (
                                    <div key={tt.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#eee', padding: '5px 10px', borderRadius: '4px' }}>
                                        <span>{tt.time.substring(0, 5)}</span>
                                        <button onClick={() => handleDelete(tt.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', padding: '0 5px' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default AdminTimetablePanel;