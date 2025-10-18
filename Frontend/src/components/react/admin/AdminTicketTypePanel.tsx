import { useState, useEffect } from 'react';

// Interfaz para el tipado de datos
interface TicketType {
  id: number;
  description: string;
  bonification?: number; // La bonificación es un número opcional
}

const AdminTicketTypePanel = () => {
  const [types, setTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTicketType, setNewTicketType] = useState({ description: '', bonification: '' });
  const [message, setMessage] = useState('');

  // Carga los datos iniciales cuando el componente se monta
  useEffect(() => {
    fetchTicketTypes();
  }, []);

  // Función para obtener los tipos de ticket desde el backend
  const fetchTicketTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/ticketTypes');
      if (response.ok) {
        const data = await response.json();
        setTypes(data.data || []);
      } else {
        throw new Error('No se pudo cargar los datos.');
      }
    } catch (error) {
      setMessage('❌ Error al cargar los tipos de tickets.');
    } finally {
      setLoading(false);
    }
  };

  // Maneja los cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTicketType(prev => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario para crear un nuevo tipo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creando tipo de ticket...');

    const bonificationValue = parseFloat(newTicketType.bonification) || 0;
    // Validación para asegurar que el valor esté entre 0 y 1
    if (bonificationValue < 0 || bonificationValue > 1) {
        setMessage('❌ La bonificación debe ser un número entre 0 y 1 (ej: 0.25 para 25%).');
        return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/ticketTypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: newTicketType.description,
          bonification: bonificationValue,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Tipo de ticket creado: ${data.data.description}`);
        fetchTicketTypes(); // Recargar la lista
        setNewTicketType({ description: '', bonification: '' }); // Limpiar formulario
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Error de conexión con el backend.');
    }
  };

  // Maneja la eliminación de un tipo de ticket
  const handleDelete = async (ticketTypeId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tipo de ticket?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/ticketTypes/${ticketTypeId}`, { method: 'DELETE' });
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
        <input 
            type="text" 
            name="description" 
            value={newTicketType.description} 
            onChange={handleInputChange} 
            placeholder="Descripción (Ej: Jubilados)" 
            required 
            style={{ padding: '10px', color: 'black', flex: 2 }} 
        />
        <input 
            type="number" 
            name="bonification" 
            value={newTicketType.bonification} 
            onChange={handleInputChange} 
            placeholder="Porcentaje (Ej: 0.25)" 
            step="0.01" // Permite incrementos de dos decimales
            min="0"    // Valor mínimo permitido
            max="1"    // Valor máximo permitido
            style={{ padding: '10px', color: 'black', flex: 1 }} 
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a88c7', color: 'white', border: 'none', borderRadius: '4px' }}>Crear</button>
      </form>

      {/* Lista de tipos de tickets existentes */}
      {loading ? <p>Cargando...</p> : (
        <div>
          {types.map((ticketType) => (
            <div key={ticketType.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{ticketType.description} - Bonificación: {((ticketType.bonification || 0) * 100).toFixed(0)}%</span>
              <button onClick={() => handleDelete(ticketType.id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px' }}>Eliminar</button>
            </div>
          ))}
        </div>
      )}

      {message && <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
};

export default AdminTicketTypePanel;