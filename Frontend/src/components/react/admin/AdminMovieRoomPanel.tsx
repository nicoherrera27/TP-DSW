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
      setMessage('Error loading rooms.');
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
      setMessage(`Room created: ${data.data.name}`);
      fetchRooms();
      setNewRoom({ name: '', capacity: '' });
    } catch (error: any) {
      setMessage(`Error creating room`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/api/halls/${id}`);
      setMessage('Room deleted successfully.');
      fetchRooms();
    } catch (error: any) {
      setMessage(`Error deleting room`);
    }
  };

  return (
    <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
      <h2>Manage Movie Rooms</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input type="text" name="name" value={newRoom.name} onChange={handleChange} placeholder="Room Name" required style={{ padding: '10px', color: 'black' }} />
        <input type="number" name="capacity" value={newRoom.capacity} onChange={handleChange} placeholder="Capacity" required style={{ padding: '10px', color: 'black' }} />
        <button type="submit">Create Room</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <div>
          {rooms.map((room) => (
            <div key={room.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{room.name} (Capacity: {room.capacity})</span>
              <button onClick={() => handleDelete(room.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
      {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
);
};

export default AdminMovieRoomPanel;