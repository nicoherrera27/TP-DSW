import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient'; 
interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  role: 'admin' | 'client';
}

const AdminUserPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<{ data: User[] }>('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      setMessage(`❌ Error al cargar usuarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'client') => {
    setMessage('');
    try {
      await api.put(`/api/users/${userId}`, { role: newRole });
      
      setUsers(currentUsers =>
        currentUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setMessage('✅ Rol actualizado correctamente.');
    } catch (error: any) {
      setMessage(`❌ Error al actualizar el rol: ${error.message}`);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción es irreversible.')) {
      return;
    }
    setMessage('');
    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
      setMessage('✅ Usuario eliminado correctamente.');
    } catch (error: any) {
      setMessage(`❌ Error al eliminar el usuario: ${error.message}`);
    }
  };

  return (
    <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto' }}>
      <h2>Lista de Usuarios Registrados</h2>
      {message && <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '1rem 0' }}>{message}</p>}
      {loading ? <p>Cargando...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Usuario</th>
                <th style={{ padding: '12px' }}>Email</th>
                <th style={{ padding: '12px' }}>Nombre</th>
                <th style={{ padding: '12px' }}>Rol</th>
                <th style={{ padding: '12px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{user.id}</td>
                  <td style={{ padding: '12px' }}>{user.username}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{`${user.name} ${user.surname}`}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'client')}
                      style={{ padding: '5px', borderRadius: '4px', color: 'black', border: '1px solid #ccc' }}
                    >
                      <option value="client">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        padding: '6px 12px',
                        cursor: 'pointer'
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserPanel;