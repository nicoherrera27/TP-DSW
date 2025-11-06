import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies }) => {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error: The request format is not valid JSON or the body is empty." }), { status: 400 });
  }

  const { username, password } = body;

  if (!username || !password) {
    return new Response(JSON.stringify({ message: "Error: Username and password are required" }), { status: 400 });
  }

  try {
    const backendUrl = 'http://localhost:3000/api/users/login';
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        throw new Error("Invalid response format from backend");
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message || 'Auth error from backend' }), { status: response.status });
    }

    const token = data.data?.token; // Acceso seguro al token
    if (!token) {
        return new Response(JSON.stringify({ message: 'No token received from backend' }), { status: 500 });
    }

    //Aca guardamos la cookie
    cookies.set('authToken', token, {
      path: '/',
      httpOnly: true, 
      secure: import.meta.env.PROD, 
      maxAge: 60 * 60 * 8, 
    });

   return new Response(JSON.stringify(data), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message || "Error connecting to authentication server" }), { status: 500 });
  }
};