import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // 1. Borramos la cookie de autenticación.
  cookies.delete('authToken', {
    path: '/',
  });

  // 2. Redirigimos al usuario a la página principal.
  return redirect('/');
};