import { useState, useEffect } from 'react';

// Definimos un tipo para nuestros tipos de tickets
interface TicketType {
  id: number;
  description: string;
}

const AdminTicketTypePanel = () => {
  // --- Estados para la lista de tipos de tickets ---
  const [types, setTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Estados para el formulario ---
  const [newTicketType, setNewTicketType] = useState({ description: '' });

  // --- Estado para mensajes ---
  const [message, setMessage] = useState('');

  // --- Cargar tipos de tickets al montar el componente ---
  useEffect(() => {
    fetchTicketTypes();
  }, []);

  const fetchTicketTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/ticketTypes');
      const data = await response.json();
      if (response.ok) {
        setTypes(data.data);
      }
    } catch (error) {
      setMessage('❌ Error al cargar los tipos de tickets.');
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones para el formulario ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTicketType(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creando tipo de ticket...');
    try {
      const res = await fetch('http://localhost:3000/api/ticketTypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newTicketType.description,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Tipo de ticket creado: ${data.data.description}`);
        fetchTicketTypes(); // Recargar la lista
        setNewTicketType({ description: '' }); // Limpiar formulario
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  const handleDelete = async (ticketTypeId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tipo de ticket?')) {
      return;
    }
    setMessage(`Eliminando tipo de ticket ID: ${ticketTypeId}...`);
    try {
      const res = await fetch(`http://localhost:3000/api/ticketTypes/${ticketTypeId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage('✅ Tipo de ticket eliminado correctamente.');
        fetchTicketTypes(); // Recargar la lista
      } else {
        const data = await res.json();
        setMessage(`❌ Error al eliminar: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };


  return (
    <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
      <h2>Gestionar Tipos de Ticket</h2>

      {/* Formulario para crear nuevo tipo de ticket */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input type="text" name="description" value={newTicketType.description} onChange={handleInputChange} placeholder="Descripción" required style={{ padding: '10px', color: 'black' }} />
        <button type="submit" style={{ padding: '10px 20px' }}>Crear</button>
      </form>

      {/* Lista de tipos de tickets existentes */}
      {loading ? <p>Cargando...</p> : (
        <div>
          {types.map((ticketType) => (
            <div key={ticketType.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{ticketType.description}</span>
              <button onClick={() => handleDelete(ticketType.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}

      {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default AdminTicketTypePanel;