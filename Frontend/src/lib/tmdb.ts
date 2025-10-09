import type{ TMDBMovie, TMDBResponse } from "../types/movies.ts";

const API_KEY = '4c13d79da36a97c80e70be9f823eb0ac';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export class TMDBApi {
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
          throw new Error('API Key inválida. Verifica tu configuración en src/lib/tmdb.ts');
        }
        throw new Error(`Error ${response.status}: ${errorData.status_message || response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getPopularMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/popular');
  }

  async getUpcomingMovies(): Promise<TMDBResponse<TMDBMovie>> {
    return this.fetchData<TMDBResponse<TMDBMovie>>('/movie/upcoming');
  }

  async searchMovies(query: string): Promise<TMDBResponse<TMDBMovie>> {
    if (!query?.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
    return this.fetchData<TMDBResponse<TMDBMovie>>('/search/movie', { 
      query: query.trim() 
    });
  }
}

export const tmdbApi = new TMDBApi();