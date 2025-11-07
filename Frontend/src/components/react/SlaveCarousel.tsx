import { useState } from 'react';
import type { TMDBMovie } from '../../types/movies'; // Usamos el tipo genérico

interface SlaveCarouselProps {
  title: string;
  movies: TMDBMovie[];
}

//

const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return 'Coming soon.';
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    };
    return new Intl.DateTimeFormat('es-AR', options).format(date).replace('.', '');
  } catch (e) { return dateString; }
};

export function SlaveCarousel({ title, movies }: SlaveCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!movies || movies.length === 0) {
    return null;
  }


  const visibleSlides = 4;
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

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <h2 className="carousel-title">{title}</h2>

        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)` }}
          >
            {movies.map((movie) => (
              <a
                href={`/movie/${movie.id}`}
                key={movie.id}
                className="carousel-slide"
                style={{ textDecoration: 'none' }}
              >
                <div className="carousel-card">
                  <div className="carousel-image-container">
                    <img
                      src={movie.poster_path ? movie.poster_path : '/placeholder-movie.png'}
                      alt={movie.title}
                      className="carousel-image"
                    />
                    <div className="carousel-image-gradient"></div>
                    <div className="carousel-image-overlay">
                      <span className="release-date">
                        {/* Si el título es "Featured movies", muestra el rating.
                          Si no, muestra la fecha.*/}
                        {title.includes('Featured')
                          ? `⭐ ${movie.vote_average.toFixed(1)} / 10`
                          : `🗓️ ${formatReleaseDate(movie.release_date)}`
                        }
                      </span>
                    </div>
                  </div>
                  <div className="carousel-card-info">
                    <h3 className="movie-title">{movie.title}</h3>
                  </div>
                </div>
              </a>
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