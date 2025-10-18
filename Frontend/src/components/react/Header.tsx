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
  const [userRole, setUserRole] = useState<'client' | 'admin' | null>(null);

  useEffect(() => {
    // Esta comprobación ahora es solo para mostrar/ocultar los botones correctamente.
    // La cookie se lee en el servidor para la seguridad real.
    const tokenExists = document.cookie.includes('authToken=');
    
    if (tokenExists) {
      setIsLoggedIn(true);
      // Podríamos decodificar el token aquí si necesitáramos el rol para algo visual,
      // pero por ahora, lo mantenemos simple.
      // Para saber si es admin, asumimos que si el link /admin es visible, lo es.
    }
    setAuthChecked(true);
  }, []);

  // ELIMINADO: La función handleLogout ya no es necesaria.

  return (
    <header className="main-header">
      <div className="container">
        <div className="top-bar">
          <a href="/" className="logo">CineVerse</a>
          <div className="user-actions">
            {authChecked && (
              <>
                {isLoggedIn ? (
                  <>
                    {/* El servidor decidirá si el usuario puede ver esta página */}
                    <a href="/admin">Panel de Admin</a>
                    {/* CORRECCIÓN: Ahora es un enlace directo a la ruta de logout */}
                    <a href="/api/auth/logout">Cerrar Sesión</a>
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