import { useState, useEffect } from 'react';
import type { TMDBMovie } from '../../types/movies'; // Asegúrate que la ruta a tus tipos sea correcta
import { tmdbApi, IMAGE_BASE_URL } from '../../lib/tmdb'; // Asegúrate que la ruta a tu API sea correcta

export function MovieCarousel() {
  // 1. Estado para almacenar las películas, el slide actual y el estado de carga
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

const getReleaseYear = (movie: TMDBMovie): string => {
  return new Date(movie.release_date).getFullYear().toString();
};

  // 2. useEffect para cargar los datos cuando el componente se monta
  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const response = await tmdbApi.getUpcomingMovies();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);
        oneMonthAgo.setHours(0, 0, 0, 0); // reseteo la hora para poder realizar la comparacion.

        const filteredMovies = response.results.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate >= oneMonthAgo;
        });

        setMovies(filteredMovies.slice(0, 10));

      } catch (error) {
        console.error('Error fetching upcoming movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMovies();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // 3. Lógica de navegación
  const totalSlides = movies.length > 3 ? movies.length - 2 : 1;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Renderizado condicional mientras carga la data
  if (loading) {
    return (
      <div className="bg-[#212121] p-6 rounded-lg">
        <div className="text-white text-lg">Cargando Estrenos...</div>
      </div>
    );
  }

  // 4. Renderizado del componente (JSX)
  return (
    <div className="bg-[#212121] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#00D1B2]"> Estrenos </h2>
      </div>

      <div className="relative overflow-hidden">
        {/* Contenedor de la "cinta" de películas */}
        <div 
          className="flex gap-4 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-shrink-0 w-1/3">
              <div className="bg-black bg-opacity-30 rounded-lg overflow-hidden backdrop-blur-sm">
                <div className="relative">
                  <img 
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`} 
                    alt={movie.title} 
                    className="w-full h-[320px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span className="font-bold text-[#00D1B2]">🗓️ {formatReleaseDate(movie.release_date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <h3 className="text-white font-semibold text-sm mb-2 h-10 line-clamp-2">
                    {movie.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botones de Navegación */}
        <button 
          onClick={handlePrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 p-3 rounded-full transition-all"
        >
          ◄
        </button>

        <button 
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 p-3 rounded-full transition-all"
        >
          ► 
        </button>

        {/* Puntos de Navegación (Dots) */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              // Clases condicionales en React
              className={`w-2 h-2 rounded-full transition-colors ${currentSlide === i ? 'bg-[#00D1B2]' : 'bg-[#4A4A4A]'}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}