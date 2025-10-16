import { useState, useEffect } from 'react';

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
      const response = await fetch('http://localhost:3000/api/halls');
      if (response.ok) setRooms((await response.json()).data);
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
      const res = await fetch('http://localhost:3000/api/halls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoom.name, capacity: parseInt(newRoom.capacity, 10) }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Sala creada: ${data.data.name}`);
        fetchRooms();
        setNewRoom({ name: '', capacity: '' });
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar esta sala?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/halls/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('✅ Sala eliminada.');
        fetchRooms();
      } else {
        setMessage(`❌ Error al eliminar: ${(await res.json()).message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión.');
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