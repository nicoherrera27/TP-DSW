import { BrowserRouter, Routes, Route } from 'react-router';
import Home from '../components/Home.tsx';
import About from '../components/About.tsx';
import MovieList from '../components/Movies.tsx';
import { SeleccionButacas } from '../components/SelectSeat.tsx';

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