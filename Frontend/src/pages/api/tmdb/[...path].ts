import type { APIRoute } from 'astro';

// CORRECCIÓN: Esta línea le dice a Astro que esta ruta debe ejecutarse en el servidor y no generarse estáticamente.
export const prerender = false;

const API_KEY = import.meta.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const GET: APIRoute = async ({ params, request }) => {
  const path = params.path;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  
  searchParams.set('api_key', API_KEY);

  const tmdbUrl = `${BASE_URL}/${path}?${searchParams.toString()}`;

  try {
    const response = await fetch(tmdbUrl);
    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify(data), { status: response.status });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error en el servidor proxy' }), { status: 500 });
  }
};