import React, { useState } from "react";
import "../css/juegos.css";
import JuegoMemoria from "./JuegoMemoria";
import Rompecabezas from "./Rompecabezas";
import Adivina from "./Adivina";
import Movimiento from "./Movimiento"; // Import the Movimiento component

const Juegos = () => {
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const [nivelRompecabezas, setNivelRompecabezas] = useState(1);

  const handleVolver = (reiniciar = false) => {
    if (reiniciar) {
      setNivelRompecabezas(1);
    }
    setJuegoSeleccionado(null);
  };

  const renderJuego = () => {
    switch (juegoSeleccionado) {
      case "memoria":
        return (
          <>
            <div className="seccion-juegos">
              <button className="volver-btn" onClick={handleVolver}>⬅ Volver</button>
              <JuegoMemoria />
            </div>
          </>
        );
      case "rompecabezas":
        return (
          <>
            <div className="seccion-juegos">
            <button className="volver-btn" onClick={() => handleVolver(false)}>⬅ Volver</button>
            <Rompecabezas nivel={nivelRompecabezas} onVolver={handleVolver} />
            </div>
          </>
        );
      case "adivina":
        return (
          <>  
            <div className="seccion-juegos">
            <button className="volver-btn" onClick={handleVolver}>⬅ Volver</button>
            <Adivina />
            </div>
          </>
        );
      case "movimiento": // Corrected case to "movimiento"
        return (
          <>
            <button className="volver-btn" onClick={handleVolver}>⬅ Volver</button>
            <Movimiento />
          </>
        );
      default:
        return null;
    }
  };

  if (juegoSeleccionado) return <div className="juegos-contenido">{renderJuego()}</div>;

  return (
    <div className="juegos-container">
      <h1 className="juegos-title animated-title">
        Diviértete mientras te conviertes en tu mejor versión
      </h1>
      <div className="juegos-grid">
        <div className="juego-card" onClick={() => setJuegoSeleccionado("memoria")}>
          <img src="/img/Memoria.png" alt="Juego de Memoria" />
          <h3>Juego de Memoria</h3>
        </div>
        <div className="juego-card" onClick={() => setJuegoSeleccionado("rompecabezas")}>
          <img src="/img/Rompecabezas.png" alt="Rompecabezas" />
          <h3>Rompecabezas</h3>
        </div>
        <div className="juego-card" onClick={() => setJuegoSeleccionado("adivina")}>
          <img src="/img/Adivina.png" alt="Adivina la Palabra" />
          <h3>Adivina la Palabra</h3>
        </div>
        <div className="juego-card" onClick={() => setJuegoSeleccionado("movimiento")}> {/* Corrected to "movimiento" */}
          <img src="/img/Movimiento.png" alt="Movimiento" />
          <h3>Movimiento</h3>
        </div>
      </div>
    </div>
  );
};

export default Juegos;
