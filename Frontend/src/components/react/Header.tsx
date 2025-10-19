import { useState, useEffect } from 'react';

const navLinks = [
  { href: '/cartelera', text: 'Cartelera' },
  { href: '/promociones', text: 'Promociones' },
  { href: '/cines', text: 'Cines' },
  { href: '/funciones-especiales', text: 'Funciones Especiales' },
];

export function Header() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Eliminamos userRole ya que no lo estábamos usando realmente aquí

  useEffect(() => {
    // --- INICIO DE LA MODIFICACIÓN ---
    console.log("Header useEffect: Verificando localStorage..."); // Log de depuración
    
    // 1. Verificamos si existe el token en localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      console.log("Header useEffect: Token encontrado!"); // Log de depuración
      setIsLoggedIn(true);
    } else {
      console.log("Header useEffect: No se encontró token."); // Log de depuración
      setIsLoggedIn(false);
    }
    setAuthChecked(true); // Marcamos que la comprobación se hizo
    // --- FIN DE LA MODIFICACIÓN ---
  }, []); // Se ejecuta solo una vez al cargar el componente

  // Función para manejar el logout (ahora borra de localStorage)
  const handleLogout = () => {
    console.log("Header handleLogout: Borrando token..."); // Log de depuración
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    // Redirigimos a la página principal después del logout
    window.location.href = '/'; 
  };

  return (
    <header className="main-header">
      <div className="container">
        <div className="top-bar">
          <a href="/" className="logo">CineVerse</a>
          <div className="user-actions">
            {/* Solo mostramos los botones cuando la comprobación inicial terminó */}
            {authChecked && ( 
              <>
                {isLoggedIn ? (
                  <>
                    {/* El link al panel de admin sigue igual */}
                    <a href="/admin">Panel de Admin</a>
                    {/* 👇 CAMBIO: Usamos un botón que llama a handleLogout */}
                    <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button> 
                  </>
                ) : (
                  <>
                    <a href="/login">Iniciar Sesión</a>
                    <a href="/register">Registrarse</a>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <nav className="main-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.text}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

// Opcional: Para que el botón de logout se vea igual que los links,
// agregá esto a tu archivo "src/styles/header.css"
/*
.logout-button {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 500;
  color: black;
  background-color: transparent;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.logout-button:hover {
  background-color: rgba(0, 0, 0, 0.15);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
*/