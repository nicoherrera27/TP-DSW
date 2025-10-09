import { useState } from "react";

export function SeleccionButacas() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seat: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const seats = ["A1", "A2", "A3", "A4", "B1", "B2"];

  return (
    <div>
      <h1>Selecciona tus butacas</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 50px)", gap: "10px" }}>
        {seats.map((seat) => (
          <button
            key={seat}
            style={{
              background: selectedSeats.includes(seat) ? "green" : "gray",
              color: "white",
              padding: "10px",
            }}
            onClick={() => toggleSeat(seat)}
          >
            {seat}
          </button>
        ))}
      </div>
    </div>
  );
} //ejemplo de como podria ser el elegir una butaca