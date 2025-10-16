import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
}

const AdminUserPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.data))
      .catch(() => setMessage('❌ Error al cargar usuarios.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ color: 'black', maxWidth: '1000px', margin: 'auto' }}>
      <h2>Lista de Usuarios Registrados</h2>
      {loading ? <p>Cargando...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #333' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Usuario</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Nombre Completo</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{user.id}</td>
                  <td style={{ padding: '10px' }}>{user.username}</td>
                  <td style={{ padding: '10px' }}>{user.email}</td>
                  <td style={{ padding: '10px' }}>{user.name} {user.surname}</td>
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