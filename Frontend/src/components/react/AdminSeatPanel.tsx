import { useState, useEffect } from 'react';

// Interfaces para tipado
interface Seat {
  id: number;
  row: number;
  number: number;
  seatRoom: { id: number; name: string; };
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

  // Cargar datos iniciales
  useEffect(() => {
    fetchRooms();
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/Seat');
      if (response.ok) {
        const data = await response.json();
        setSeats(data.data);
      }
    } catch (error) {
      setMessage('❌ Error al cargar los asientos.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/halls');
      if (response.ok) {
        const data = await response.json();
        setRooms(data.data);
        // Seleccionar la primera sala por defecto si existe
        if (data.data.length > 0) {
          setNewSeat(prev => ({ ...prev, seatRoom: data.data[0].id.toString() }));
        }
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
    if (!newSeat.seatRoom) {
      setMessage('❌ Debes seleccionar una sala.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/Seat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row: parseInt(newSeat.row, 10),
          number: parseInt(newSeat.number, 10),
          seatRoom: parseInt(newSeat.seatRoom, 10),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Asiento creado (Fila: ${data.data.row}, N°: ${data.data.number})`);
        fetchSeats();
        setNewSeat(prev => ({ ...prev, row: '', number: '' }));
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este asiento?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/Seat/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage('✅ Asiento eliminado.');
        fetchSeats();
      } else {
        setMessage(`❌ Error al eliminar: ${(await res.json()).message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión.');
    }
  };

  return (
    <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gestionar Asientos</h2>
      <div style={{ padding: '1rem', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '8px', marginBottom: '1rem', color: '#6b4f0a' }}>
        <strong>Importante:</strong> Para crear un asiento, primero debe existir una <a href="/admin/salas" style={{color: '#1a88c7', textDecoration: 'underline'}}>Sala</a> a la cual asignarlo.
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select name="seatRoom" value={newSeat.seatRoom} onChange={handleChange} required style={{ padding: '10px', color: 'black' }}>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </select>
        <input type="number" name="row" value={newSeat.row} onChange={handleChange} placeholder="Fila" required style={{ padding: '10px', color: 'black' }} />
        <input type="number" name="number" value={newSeat.number} onChange={handleChange} placeholder="Número" required style={{ padding: '10px', color: 'black' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a88c7', color: 'white', border: 'none', borderRadius: '4px' }}>Crear Asiento</button>
      </form>

      {loading ? <p>Cargando asientos...</p> : (
        <div>
          {seats.map((seat) => (
            <div key={seat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>Sala: <strong>{seat.seatRoom?.name || 'N/A'}</strong> - Fila: <strong>{seat.row}</strong>, Asiento: <strong>{seat.number}</strong></span>
              <button onClick={() => handleDelete(seat.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}
      {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default AdminSeatPanel;