import type { TMDBResponse, TMDBMovieDetail, TMDBMovie, TMDBVideoResponse } from "../types/movies";

const PROXY_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

export class TMDBService {
  private async fetchData<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const searchParams = new URLSearchParams({
      language: 'en-US',
      ...params
    });

    const relativeUrl = `${PROXY_BASE_URL}${endpoint}?${searchParams}`;
    
    // CORRECCIÓN: Determinamos la URL final dependiendo del entorno (servidor o cliente).
    let finalUrl: string;

    if (import.meta.env.SSR) {
      // Si estamos en el servidor (SSR), necesitamos la URL completa para hacer la llamada.
      const siteUrl = import.meta.env.SITE_URL;
      finalUrl = new URL(relativeUrl, siteUrl).toString();
    } else {
      // Si estamos en el cliente (navegador), la URL relativa es suficiente.
      finalUrl = relativeUrl;
    }
    
    try {
      const response = await fetch(finalUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.status_message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data through proxy:', error);
      throw error;
    }
  }

  // --- NINGUNO DE LOS MÉTODOS DE AQUÍ PARA ABAJO NECESITA CAMBIOS ---

  async getMovieDetails(movieId: number): Promise<TMDBMovieDetail> {
    return this.fetchData<TMDBMovieDetail>(`/movie/${movieId}`);
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/popular', { page: page.toString() });
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/top_rated', { page: page.toString() });
  }

  async getTrendingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/trending/movie/day');
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/now_playing', { page: page.toString() });
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/upcoming', { page: page.toString() });
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    if (!query?.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    return this.fetchData<TMDBResponse<TMDBMovie>>('/search/movie', { 
      query: query.trim(),
      page: page.toString()
    });
  }

  async getMovieVideos(movieId: number): Promise<TMDBVideoResponse> {
    return this.fetchData<TMDBVideoResponse>(`/movie/${movieId}/videos`);
  }

  getImageUrl(path: string | null, size: 'small' | 'medium' | 'large' = 'medium'): string | null {
    if (!path) return null;
    const sizes = { small: 'w200', medium: 'w500', large: 'original' };
    return `https://image.tmdb.org/t/p/${sizes[size]}${path}`;
  }
}

export const tmdbService = new TMDBService();