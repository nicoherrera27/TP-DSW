import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

interface Seat {
  id: number;
  row: number;
  number: number;
  seatRoom?: { id: number; name: string; };
}
interface MovieRoom {
  id: number;
  name: string;
}

const AdminSeatPanel = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [rooms, setRooms] = useState<MovieRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSeat, setNewSeat] = useState({ row: '', number: '', seatRoom: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRooms();
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const data = await api.get<{ data: Seat[] }>('/api/Seat');
      setSeats(data.data);
    } catch (error) {
      setMessage('❌ Error al cargar los asientos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await api.get<{ data: MovieRoom[] }>('/api/halls');
      setRooms(data.data);
      if (data.data.length > 0) {
        setNewSeat(prev => ({ ...prev, seatRoom: data.data[0].id.toString() }));
      }
    } catch (error) {
      setMessage('❌ Error al cargar las salas.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSeat(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeat.seatRoom) return setMessage('❌ Debes seleccionar una sala.');
    
    try {
      const data = await api.post<{ data: Seat }>('/api/Seat', {
        row: parseInt(newSeat.row, 10),
        number: parseInt(newSeat.number, 10),
        seatRoom: parseInt(newSeat.seatRoom, 10),
      });
      setMessage(`✅ Asiento creado (Fila: ${data.data.row}, N°: ${data.data.number})`);
      fetchSeats();
      setNewSeat(prev => ({ ...prev, row: '', number: '' }));
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este asiento?')) return;
    try {
      await api.delete(`/api/Seat/${id}`);
      setMessage('✅ Asiento eliminado.');
      fetchSeats();
    } catch (error: any) {
      setMessage(`❌ Error al eliminar: ${error.message}`);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Gestionar Asientos</h2>
      <div className="admin-notice">
        <strong>Importante:</strong> Para crear un asiento, primero debe existir una <a href="/admin/salas">Sala</a> a la cual asignarlo.
      </div>
      <form onSubmit={handleSubmit} className="admin-form">
        <select name="seatRoom" value={newSeat.seatRoom} onChange={handleChange} required>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </select>
        <input type="number" name="row" value={newSeat.row} onChange={handleChange} placeholder="Fila" required />
        <input type="number" name="number" value={newSeat.number} onChange={handleChange} placeholder="Número" required />
        <button type="submit">Crear Asiento</button>
      </form>
      {loading ? <p>Cargando asientos...</p> : (
        <div>
          {seats.map((seat) => (
            <div key={seat.id} className="admin-list-item">
              <span>Sala: <strong>{seat.seatRoom?.name || 'N/A'}</strong> - Fila: <strong>{seat.row}</strong>, Asiento: <strong>{seat.number}</strong></span>
              <button onClick={() => handleDelete(seat.id)} className="delete-button">Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {message && <p className="admin-message">{message}</p>}
    </div>
  );
};

export default AdminSeatPanel;