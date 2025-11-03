import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  console.log("LOGIN API ROUTE: Headers recibidos:", request.headers);

  let body;
  try {

    body = await request.json();
    console.log("LOGIN API ROUTE: Cuerpo recibido:", body);
  } catch (error) {
    console.error("LOGIN API ROUTE: Error al parsear JSON:", error);

    return new Response(JSON.stringify({ message: "El formato de la petición no es un JSON válido o el cuerpo está vacío." }), { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return new Response(JSON.stringify({ message: "Usuario y contraseña son requeridos" }), { status: 400 });
  }

  try {
    const backendUrl = 'http://localhost:3000/api/users/login';
    console.log(`LOGIN API ROUTE: Enviando a backend: ${backendUrl}`);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log(`LOGIN API ROUTE: Respuesta del backend: ${response.status}`);

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        console.error("LOGIN API ROUTE: Backend devolvió respuesta no-JSON:", text);
        throw new Error("Respuesta inesperada del servidor de autenticación");
    }

    if (!response.ok) {
      console.error("LOGIN API ROUTE: Error del backend:", data);
      return new Response(JSON.stringify({ message: data.message || 'Error de autenticación del backend' }), { status: response.status });
    }

    const token = data.data?.token; // Acceso seguro al token
    if (!token) {
        console.error("LOGIN API ROUTE: Token no encontrado en respuesta del backend:", data);
        return new Response(JSON.stringify({ message: 'No se recibió token del servidor backend' }), { status: 500 });
    }

    //Aca guardamos la cookie
    cookies.set('authToken', token, {
      path: '/',
      httpOnly: true, 
      secure: import.meta.env.PROD, 
      maxAge: 60 * 60 * 8, 
    });

    console.log("LOGIN API ROUTE: Cookie establecida. Login exitoso.");

   return new Response(JSON.stringify(data), { status: 200 });

  } catch (error: any) {
    console.error("LOGIN API ROUTE: Error de conexión con el backend:", error);
    return new Response(JSON.stringify({ message: error.message || "Error de conexión con el servidor de autenticación" }), { status: 500 });
  }
};