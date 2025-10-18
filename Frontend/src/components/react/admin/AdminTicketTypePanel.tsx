import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';

interface TicketType { id: number; description: string; bonification?: number; }

const AdminTicketTypePanel = () => {
    const [types, setTypes] = useState<TicketType[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTicketType, setNewTicketType] = useState({ description: '', bonification: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTicketTypes();
    }, []);

    const fetchTicketTypes = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ data: TicketType[] }>('/api/ticketTypes');
            setTypes(response.data || []);
        } catch (error) {
            setMessage('❌ Error al cargar los tipos de tickets.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTicketType(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const bonificationValue = parseFloat(newTicketType.bonification) || 0;
        if (bonificationValue < 0 || bonificationValue > 1) {
            return setMessage('❌ La bonificación debe ser un número entre 0 y 1.');
        }
        setMessage('Creando tipo de ticket...');
        try {
            const data = await api.post<{ data: TicketType }>('/api/ticketTypes', {
                description: newTicketType.description,
                bonification: bonificationValue,
            });
            setMessage(`✅ Tipo de ticket creado: ${data.data.description}`);
            fetchTicketTypes();
            setNewTicketType({ description: '', bonification: '' });
        } catch (error: any) {
            setMessage(`❌ Error: ${error.message}`);
        }
    };

    const handleDelete = async (ticketTypeId: number) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este tipo de ticket?')) return;
        try {
            await api.delete(`/api/ticketTypes/${ticketTypeId}`);
            setMessage('✅ Tipo de ticket eliminado correctamente.');
            fetchTicketTypes();
        } catch (error: any) {
            setMessage(`❌ Error al eliminar: ${error.message}`);
        }
    };

    return (
        <div style={{ color: 'black', maxWidth: '800px', margin: 'auto' }}>
            <h2>Gestionar Tipos de Ticket</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input type="text" name="description" value={newTicketType.description} onChange={handleInputChange} placeholder="Descripción (Ej: Jubilados)" required style={{ padding: '10px', color: 'black', flex: 2 }} />
                <input type="number" name="bonification" value={newTicketType.bonification} onChange={handleInputChange} placeholder="Porcentaje (Ej: 0.25)" step="0.01" min="0" max="1" style={{ padding: '10px', color: 'black', flex: 1 }} />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a88c7', color: 'white', border: 'none', borderRadius: '4px' }}>Crear</button>
            </form>
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