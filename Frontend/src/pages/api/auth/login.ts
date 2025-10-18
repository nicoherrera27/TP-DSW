import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  // 1. Leemos el cuerpo de la petición como texto plano primero.
  const rawBody = await request.text();

  // 2. Verificamos si el cuerpo está vacío. Si lo está, devolvemos un error claro.
  if (!rawBody) {
    return new Response(JSON.stringify({ message: "La petición llegó con el cuerpo vacío." }), { status: 400 });
  }

  let body;
  try {
    // 3. Intentamos parsear el texto a JSON.
    body = JSON.parse(rawBody);
  } catch (error) {
    return new Response(JSON.stringify({ message: "El formato de la petición no es un JSON válido." }), { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return new Response(JSON.stringify({ message: "Usuario y contraseña son requeridos" }), { status: 400 });
  }

  try {
    // 4. Continuamos con la lógica normal de autenticación.
    const response = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message || 'Error de autenticación' }), { status: response.status });
    }

    const token = data.data.token;
    cookies.set('authToken', token, {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      maxAge: 60 * 60 * 8, // 8 horas
    });

    // Devolvemos una respuesta exitosa, y el frontend se encarga de redirigir.
    return new Response(JSON.stringify({ message: 'Login exitoso' }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Error de conexión con el servidor de autenticación" }), { status: 500 });
  }
};