import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  //Borramos la cookie de autenticación y redirigimos al usuario a la página principal.
  cookies.delete('authToken', {
    path: '/',
  });
  return redirect('/');
};