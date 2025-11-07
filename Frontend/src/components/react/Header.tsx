import { useState } from 'react';

const navLinks = [
  { href: '/cartelera', text: 'Movies' },
  { href: '/promociones', text: 'Promos' },
  { href: '/funciones-especiales', text: 'Special Functions' },
];

interface HeaderProps {
  isLoggedIn: boolean;
  userRole: 'admin' | 'client' | null;
}

export function Header({ isLoggedIn: initialIsLoggedIn, userRole }: HeaderProps) {
  // El estado se inicializa con las props que vienen del servidor
  const [isLoggedIn] = useState(initialIsLoggedIn);

  const handleLogout = () => {
    // Redirige a la ruta que borra la cookie del servidor
    window.location.href = '/api/auth/logout';
  };

  return (
    <header className="main-header">
      <div className="container">
        <div className="top-bar">
          <a href="/" className="logo">CineVerse</a>
          <div className="user-actions">
            {isLoggedIn ? (
              <>
                {/* Muestra el panel solo si el rol es 'admin' */}
                {userRole === 'admin' && <a href="/admin">Admin Panel</a>}
                <a onClick={handleLogout} className="logout-button">Logout</a> 
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
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