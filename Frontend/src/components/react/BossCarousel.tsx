import { useState, useEffect } from 'react';
import { api } from '@/services/apiClient';
import type { TMDBMovie } from '../../types/movies';
import { SlaveCarousel } from './SlaveCarousel.tsx';

interface LocalMovie {
  id: number;
  tmdbId: number;
  name: string;
  url: string; 
  releaseDate?: string;
  rating?: number;
}

const mapLocalToTMDB = (movie: LocalMovie): TMDBMovie => ({
  id: movie.tmdbId, 
  title: movie.name,
  poster_path: movie.url, 
  release_date: movie.releaseDate || '', 
  vote_average: movie.rating || 0,
  
  original_title: movie.name,
  overview: '',
  backdrop_path: null,
  vote_count: 0,
  popularity: 0,
  adult: false,
  genre_ids: [],
  original_language: '',
  video: false,
});

export function BossCarousel() {
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBMovie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        setLoading(true);
        const [topRatedResponse, upcomingResponse] = await Promise.all([
          api.get<{ data: LocalMovie[] }>('/api/movies/top-rated'),
          api.get<{ data: LocalMovie[] }>('/api/movies/upcoming')
        ]);

        const topRated = (topRatedResponse.data || []).map(mapLocalToTMDB);
        const upcoming = (upcomingResponse.data || []).map(mapLocalToTMDB);

        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);

      } catch (error) {
        console.error('Error fetching carousel movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarousels();
  }, []);

  if (loading) {
    return (
      <div className="carousel-container">
        <div className="loading-text">Cargando...</div>
      </div>
    );
  }

  return (
    <>
      <SlaveCarousel title="Mejores Valoradas" movies={topRatedMovies} />
      <SlaveCarousel title="Próximos Estrenos" movies={upcomingMovies} />
    </>
  );
}