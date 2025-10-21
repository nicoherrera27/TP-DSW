import type { AstroCookies } from 'astro';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: number;
  username: string;
  role: 'admin' | 'client';
}

export function getAuthenticatedUser(cookies: AstroCookies): UserPayload | null {
  const token = cookies.get('authToken')?.value;
  
  if (!token) {
    return null;
  }

  try {
    // Verificamos el token con el mismo secreto que usa el backend.
    // Asegúrate de tener JWT_SECRET en tu .env del frontend.
    const decoded = jwt.verify(token, import.meta.env.JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    // Si el token es inválido o expiró, lo tratamos como nulo.
    return null;
  }
}