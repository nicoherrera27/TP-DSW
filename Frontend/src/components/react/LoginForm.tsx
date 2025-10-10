import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Usuario logueado con éxito');
        setFormData({
          username: '',
          password: ''
        });
      } else{
        setMessage(` Error: ${data.message}`);
      }
    } catch (err) {
      setMessage(' Error al conectar con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inicio de sesión</h2>

      <input type="text" name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
      <button type="submit">Ingresar</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default LoginForm;
