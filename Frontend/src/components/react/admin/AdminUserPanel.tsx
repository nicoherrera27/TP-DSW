import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient'; // Import the secure API client

// Update the User interface to include the role
interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  role: 'admin' | 'client'; // Add the role property
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

  // Function to handle role changes
  const handleRoleChange = async (userId: number, newRole: 'admin' | 'client') => {
    setMessage('');
    try {
      await api.put(`/api/users/${userId}`, { role: newRole });
      
      // Update the user's role in the local state to reflect the change immediately
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

  return (
    <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto' }}>
      <h2>Lista de Usuarios Registrados</h2>
      {loading ? <p>Cargando...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                {/* ... otros th ... */}
                <th style={{ padding: '10px', textAlign: 'left' }}>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{user.id}</td>
                  {/* ... otros td ... */}
                  <td style={{ padding: '10px' }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'client')}
                      style={{ padding: '5px', borderRadius: '4px', color: 'black' }}
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
);
};
export default AdminUserPanel;