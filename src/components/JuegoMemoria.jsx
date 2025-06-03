import React, { useState, useEffect } from "react";
import "../css/JuegoMemoria.css";

const imagenes = [
  "creatividad.png", "disciplina.png", "feliz.png",
  "enojado.png", "triste.png", "comunicacion.png"
];

// Función para calcular filas y columnas para un número dado de cartas
const calcularFilasColumnas = (numCartas) => {
  let columnas = Math.ceil(Math.sqrt(numCartas));
  let filas = Math.ceil(numCartas / columnas);
  return { filas, columnas };
};

const getShuffledCards = (nivel) => {
  const total = nivel * nivel;
  // Si el total es impar, restamos 1 para hacerlo par
  const cantidadCartas = total % 2 === 0 ? total : total - 1;
  const pares = imagenes
    .flatMap(img => [img, img])
    .slice(0, cantidadCartas);

  return pares.sort(() => Math.random() - 0.5);
};

const JuegoMemoria = ({ onVolver }) => {
  const [nivel, setNivel] = useState(2); // 2x2, luego 4x4, 6x6...
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [bloqueado, setBloqueado] = useState(true);
  const [tiempo, setTiempo] = useState(120);

  // Estado para filas y columnas calculados
  const [filasCols, setFilasCols] = useState({ filas: nivel, columnas: nivel });

  useEffect(() => {
    const nuevas = getShuffledCards(nivel);
    setCartas(nuevas);
    setVolteadas(Array(nuevas.length).fill(true));
    setEncontradas([]);
    setBloqueado(true);
    setTiempo(120);

    // Calculamos filas y columnas para la cuadrícula según la cantidad de cartas
    const { filas, columnas } = calcularFilasColumnas(nuevas.length);
    setFilasCols({ filas, columnas });

    const mostrarTimeout = setTimeout(() => {
      setVolteadas(Array(nuevas.length).fill(false));
      setBloqueado(false);
    }, 3000);

    return () => clearTimeout(mostrarTimeout);
  }, [nivel]);

  useEffect(() => {
    if (bloqueado || tiempo <= 0) return;
    const interval = setInterval(() => {
      setTiempo((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [bloqueado]);

  useEffect(() => {
    if (tiempo === 0) {
      alert("Perdiste. Comienza de nuevo.");
      setNivel(2);
    }
  }, [tiempo]);

  const manejarClick = (index) => {
    if (bloqueado || volteadas[index] || encontradas.includes(index)) return;

    const nuevaVolteadas = [...volteadas];
    nuevaVolteadas[index] = true;
    setVolteadas(nuevaVolteadas);

    const seleccionadas = nuevaVolteadas
      .map((v, i) => (v && !encontradas.includes(i) ? i : null))
      .filter((i) => i !== null);

    if (seleccionadas.length === 2) {
      const [i1, i2] = seleccionadas;
      setBloqueado(true);
      setTimeout(() => {
        if (cartas[i1] === cartas[i2]) {
          const nuevasEncontradas = [...encontradas, i1, i2];
          setEncontradas(nuevasEncontradas);
          if (nuevasEncontradas.length === cartas.length) {
            setNivel((prev) => prev + 2); // sube en pares: 2x2, 4x4, 6x6...
          }
        } else {
          nuevaVolteadas[i1] = false;
          nuevaVolteadas[i2] = false;
        }
        setVolteadas(nuevaVolteadas);
        setBloqueado(false);
      }, 1000);
    }
  };

  return (
    <div className="juego-memoria">
      <div className="timer">
        Tiempo: {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, "0")}
      </div>

      <div
        className="grid-memoria"
        style={{
          gridTemplateColumns: `repeat(${filasCols.columnas}, 1fr)`,
          gridTemplateRows: `repeat(${filasCols.filas}, 1fr)`,
        }}
      >
        {cartas.map((img, i) => (
          <div
            key={i}
            className={`carta ${volteadas[i] || encontradas.includes(i) ? "activa" : ""}`}
            onClick={() => manejarClick(i)}
          >
            {volteadas[i] || encontradas.includes(i) ? (
              <img src={`/img/${img}`} alt="carta" />
            ) : (
              <div className="reverso" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JuegoMemoria;
