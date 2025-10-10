import { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Íconos para mostrar/ocultar contraseña
  const eyeIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFF">
          <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
      </svg>
  );

  const eyeOffIcon = (
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFF">
          <path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
      </svg>
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        setIsError(false);
        setFormData({
          username: '',
          password: ''
        });
      } else{
        setMessage(` Error: ${data.message}`);
        setIsError(true);
      }
    } catch (err) {
      setMessage(' Error al conectar con el servidor');
      setIsError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h1>Iniciar Sesión</h1>

      <input type="text" name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} required />
      <div className="password-wrapper">
        <input 
            type={showPassword ? "text" : "password"} 
            name='password' 
            placeholder='Contraseña' 
            value={formData.password} 
            onChange={handleChange} 
            required 
        />
        <button type="button" onClick={togglePasswordVisibility} className="password-toggle-btn">
            {showPassword ? eyeOffIcon : eyeIcon}
        </button>
      </div>
      <button type="submit">Ingresar</button>

      {message && <p className={`register-message ${isError ? 'error' : 'success'}`}>{message}</p>}
    </form>
  );
};

export default LoginForm;