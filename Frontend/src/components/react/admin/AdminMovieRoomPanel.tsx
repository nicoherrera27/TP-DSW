import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

interface MovieRoom {
  id: number;
  name: string;
  capacity: number;
}

const AdminMovieRoomPanel = () => {
  const [rooms, setRooms] = useState<MovieRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({ name: '', capacity: '' });
  const [message, setMessage] = useState('');

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: MovieRoom[] }>('/api/halls');
      setRooms(response.data);
    } catch (error) {
      setMessage('❌ Error al cargar las salas.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.post<{ data: MovieRoom }>('/api/halls', { 
        name: newRoom.name, 
        capacity: parseInt(newRoom.capacity, 10) 
      });
      setMessage(`✅ Sala creada: ${data.data.name}`);
      fetchRooms();
      setNewRoom({ name: '', capacity: '' });
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta sala?')) return;
    try {
      await api.delete(`/api/halls/${id}`);
      setMessage('✅ Sala eliminada.');
      fetchRooms();
    } catch (error: any) {
      setMessage(`❌ Error al eliminar: ${error.message}`);
    }
  };

  return (
    <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gestionar Salas de Cine</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input type="text" name="name" value={newRoom.name} onChange={handleChange} placeholder="Nombre de la sala" required style={{ padding: '10px', color: 'black' }} />
        <input type="number" name="capacity" value={newRoom.capacity} onChange={handleChange} placeholder="Capacidad" required style={{ padding: '10px', color: 'black' }} />
        <button type="submit">Crear Sala</button>
      </form>
      {loading ? <p>Cargando...</p> : (
        <div>
          {rooms.map((room) => (
            <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{room.name} (Capacidad: {room.capacity})</span>
              <button onClick={() => handleDelete(room.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
);
};

export default AdminMovieRoomPanel;