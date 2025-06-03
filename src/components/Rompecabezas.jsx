import React, { useState, useEffect } from "react";
import "../css/rompecabezas.css";

const imagenes = [
  "feliz.png",
  "creatividad.png",
  "disciplina.png",
  "enojado.png",
  "triste.png",
  "comunicacion.png",
  "organizacion.png",
  "Memoria.png",
  "Rompecabezas.png",
];

const Rompecabezas = ({ onVolver }) => {
  const [nivel, setNivel] = useState(1);
  const [filas, setFilas] = useState(3);
  const [columnas, setColumnas] = useState(3);
  const [orden, setOrden] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [ganaste, setGanaste] = useState(false);
  const [tiempo, setTiempo] = useState(120);
  const [mostrandoArmado, setMostrandoArmado] = useState(true);
  const total = filas * columnas;

  const imagenActual = `/img/${imagenes[(nivel - 1) % imagenes.length]}`;

  // Mostrar imagen armada durante 4 segundos
  useEffect(() => {
    const ordenInicial = Array.from({ length: total }, (_, i) => i);
    setOrden(ordenInicial);
    setGanaste(false);
    setTiempo(120);
    setMostrandoArmado(true);

    const timeout = setTimeout(() => {
      const piezasMezcladas = ordenInicial.sort(() => Math.random() - 0.5);
      setOrden(piezasMezcladas);
      setMostrandoArmado(false);
    }, 4000); // Mostrar imagen armada 4 segundos

    return () => clearTimeout(timeout);
  }, [nivel]);

  // Cronómetro
  useEffect(() => {
    if (mostrandoArmado) return;

    const intervalo = setInterval(() => {
      setTiempo((t) => {
        if (t <= 1) {
          alert("¡Tiempo terminado! Reiniciando nivel.");
          reiniciarNivel();
          return 120;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [mostrandoArmado]);

  // Verifica si el jugador ganó
  useEffect(() => {
    if (!mostrandoArmado && orden.length && orden.every((val, idx) => val === idx)) {
      setGanaste(true);
      setTimeout(() => {
        const nuevoNivel = nivel + 1;
        setNivel(nuevoNivel);
        const nuevaDificultad = 3 + Math.floor(nuevoNivel / 2);
        setFilas(nuevaDificultad);
        setColumnas(nuevaDificultad);
      }, 1500);
    }
  }, [orden, mostrandoArmado]);

  const reiniciarNivel = () => {
    const piezas = Array.from({ length: total }, (_, i) => i).sort(() => Math.random() - 0.5);
    setOrden(piezas);
    setSeleccionada(null);
    setGanaste(false);
    setTiempo(120);
  };

  const intercambiar = (index) => {
    if (mostrandoArmado) return;

    if (seleccionada === null) {
      setSeleccionada(index);
    } else {
      const nuevoOrden = [...orden];
      [nuevoOrden[index], nuevoOrden[seleccionada]] = [
        nuevoOrden[seleccionada],
        nuevoOrden[index],
      ];
      setOrden(nuevoOrden);
      setSeleccionada(null);
    }
  };

  return (
    <div className="rompecabezas-container">
      <div className="timer">
        Tiempo: {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, "0")}
      </div>
      {ganaste && <div className="mensaje-ganar">¡Completado!</div>}

      <div
        className="rompecabezas-grid"
        style={{
          gridTemplateRows: `repeat(${filas}, 1fr)`,
          gridTemplateColumns: `repeat(${columnas}, 1fr)`,
        }}
      >
        {orden.map((pos, index) => {
          const row = Math.floor(pos / columnas);
          const col = pos % columnas;
          return (
            <div
              key={index}
              className={`pieza ${seleccionada === index ? "seleccionada" : ""}`}
              onClick={() => intercambiar(index)}
              style={{
                backgroundImage: `url(${imagenActual})`,
                backgroundSize: `${columnas * 100}% ${filas * 100}%`,
                backgroundPosition: `${(col * 100) / (columnas - 1)}% ${(row * 100) / (filas - 1)}%`,
              }}
            />
          );
        })}
      </div>

      <div className="btn-retroceder" onClick={onVolver}>⬅</div>
    </div>
  );
};

export default Rompecabezas;
