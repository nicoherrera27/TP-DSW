import { useEffect, useState } from "react";
//import { apiFetch } from "../api/client.ts";
//import { Link } from "react-router";

type Movie = {
  id: string;
  name: string;
  duration: string;
  synopsis: string;
  url: string;
};

export default function MovieList(){
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  fetch("http://localhost:3000/api/movies")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error al obtener las peliculas");
      }
      return res.json();
    })
    .then((response) => {
      console.log(response.data);
      setMovies(response.data);
      setLoading(false);
    })
    .catch((err: Error) => {
      setError(err.message);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Cartelera</h1>
      {movies.length === 0 ? (
        <p>No hay peliculas en la base de datos.</p>
      ) : (
        <ul>
          {movies.map((mov) => (
            <div key={mov.id}>
              <img src={mov.url} alt="movie url" height= "300px"/>
              <br />
              <strong>{mov.name}</strong>: {mov.duration}
              <br />
              <em>{mov.synopsis}</em>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
} 

/*type Movie = {
  id: string;
  title: string;
  poster_url: string;
};


export function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    apiFetch("/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.error("Error cargando películas", err));
  }, []);

 return (
    <div>
      <h1>Cartelera</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        {movies.map((movie) => (
          <Link key={movie.id} to={`/pelicula/${movie.id}`}>
           <img src={movie.poster_url} alt={movie.title} width="200" />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} //ejemplo de como seria la cartelera de las peliculas de esa semana_*/