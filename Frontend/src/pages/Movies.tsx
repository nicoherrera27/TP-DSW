//import { useEffect, useState } from "react";
//import { apiFetch } from "../client";
//import { Link } from "react-router-dom";

//type Movie = {
//  id: string;
//  title: string;
//  poster_url: string;
//};

//export function Movies() {
//  const [movies, setMovies] = useState<Movie[]>([]);

//  useEffect(() => {
//    apiFetch("/movies")
//      .then((res) => setMovies(res.data))
//      .catch((err) => console.error("Error cargando películas", err));
//  }, []);

// return (
//    <div>
//      <h1>Cartelera</h1>
//      <div style={{ display: "flex", gap: "20px" }}>
//        {movies.map((movie) => (
//          <Link key={movie.id} to={`/pelicula/${movie.id}`}>
//           <img src={movie.poster_url} alt={movie.title} width="200" />
//            <p>{movie.title}</p>
//          </Link>
//        ))}
//      </div>
//    </div>
//  );
//} //ejemplo de como seria la cartelera de las peliculas de esa semana