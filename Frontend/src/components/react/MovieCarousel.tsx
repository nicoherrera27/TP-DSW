import { useState, useEffect } from 'react';
import type { TMDBMovie } from '../../types/movies';
import { tmdbService, IMAGE_BASE_URL } from '../../services/tmdbService';

export function MovieCarousel() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    };
    return new Intl.DateTimeFormat('es-AR', options).format(date).replace('.', '');
  };

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const pagesToFetch = [1, 2, 3];
        const promises = pagesToFetch.map(page => tmdbService.getUpcomingMovies(page));
        const responses = await Promise.all(promises);
        const allUpcomingMovies = responses.flatMap(response => response.results);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureMovies = allUpcomingMovies.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate >= today;
        });

        setMovies(futureMovies.slice(0, 10));
      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingMovies();
  }, []);

  // Se muestran 3 slides a la vez
  const visibleSlides = 3;
  const totalSlides = movies.length > visibleSlides ? movies.length - (visibleSlides - 1) : 1;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  if (loading) {
    return (
      <div className="carousel-container">
        <div className="loading-text">Cargando Estrenos...</div>
      </div>
    );
  }

  return (
    <section className="carousel-section">
      <div className="carousel-container">
          <h2 className="carousel-title">Próximos Estrenos</h2>

        <div className="carousel-wrapper">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)` }}
          >
            {movies.map((movie) => (
              <div key={movie.id} className="carousel-slide">
                <div className="carousel-card">
                  <div className="carousel-image-container">
                    <img 
                      src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder-movie.png'} 
                      alt={movie.title} 
                      className="carousel-image"
                    />
                    <div className="carousel-image-gradient"></div>
                    <div className="carousel-image-overlay">
                      <span className="release-date">🗓️ {formatReleaseDate(movie.release_date)}</span>
                    </div>
                  </div>
                  <div className="carousel-card-info">
                    <h3 className="movie-title">{movie.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={handlePrev} className="carousel-nav prev">‹</button>
          <button onClick={handleNext} className="carousel-nav next">›</button>

          <div className="carousel-dots">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}