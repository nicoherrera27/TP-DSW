const API_KEY = '4c13d79da36a97c80e70be9f823eb0ac';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
import type { TMDBResponse, TMDBMovieDetail, TMDBMovie, TMDBVideoResponse  } from "../types/movies";


export class TMDBService {
  private async fetchData<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'es-MX',
    ...params
    });

    const url = `${BASE_URL}${endpoint}?${searchParams}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('API Key inválida de TMDB');
        }
        throw new Error(`Error ${response.status}: ${errorData.status_message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
  // Obtener detalles completos de una película (incluye duración)
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetail> {
    return this.fetchData<TMDBMovieDetail>(`/movie/${movieId}`);
  }

  // Películas populares
  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/popular', { page: page.toString() });
  }

  // Películas mejor valoradas
  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page: page.toString() });
  }

  // Películas en tendencia
  async getTrendingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/trending/movie/day');
  }

  // Películas que están en cines ahora
  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/now_playing', { page: page.toString() });
  }

  // Próximos estrenos
  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/upcoming', { page: page.toString() });
  }

  // Buscar películas
  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    if (!query?.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    return this.fetchData<TMDBResponse<TMDBMovie>>('/search/movie', { 
      query: query.trim(),
      page: page.toString()
    });
  }

  // Trailer de yt
  async getMovieVideos(movieId: number): Promise<TMDBVideoResponse> {
    return this.fetchData<TMDBVideoResponse>(`/movie/${movieId}/videos`);
  }

  // Convertir película de TMDB a formato de tu sistema
  movieToLocal(tmdbMovie: TMDBMovieDetail) {
    return {
      tmdb_id: tmdbMovie.id,
      title: tmdbMovie.title,
      original_title: tmdbMovie.original_title,
      synopsis: tmdbMovie.overview,
      duration: tmdbMovie.runtime, // en minutos
      poster_url: tmdbMovie.poster_path 
        ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}` 
        : null,
      backdrop_url: tmdbMovie.backdrop_path 
        ? `${BACKDROP_BASE_URL}${tmdbMovie.backdrop_path}` 
        : null,
      release_date: tmdbMovie.release_date,
      rating: tmdbMovie.vote_average,
      genres: tmdbMovie.genres.map(g => g.name),
      language: tmdbMovie.original_language,
    };
  }

  // Obtener URL completa de imagen
  getImageUrl(path: string | null, size: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (!path) return null;
    
    const sizes = {
      small: 'w200',
      medium: 'w500',
      large: 'original'
    };
    
    return `https://image.tmdb.org/t/p/${sizes[size]}${path}`;
  }
}

export const tmdbService = new TMDBService();