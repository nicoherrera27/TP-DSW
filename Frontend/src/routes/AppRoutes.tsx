import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '../pages/Home.tsx';
import About from '../pages/About.tsx';
import MovieList from '../pages/Movies.tsx';
import { SeleccionButacas } from '../pages/SelectSeat.tsx';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/select-seat" element={<SeleccionButacas />} />
      </Routes>
    </BrowserRouter>
  );
}