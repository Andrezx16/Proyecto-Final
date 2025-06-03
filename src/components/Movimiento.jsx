import React, { useState, useEffect } from 'react';

const images = [
  'feliz.png',
  'triste.png',
  'enojo.png',
  'creatividad.png',
  'disciplina.png',
  'comunicacion.png',
  'organizacion.png',
  'bubbles.png',
  '20728f30-8707-4e63-b736-4472e0b00b4b.png',
];

const shuffleArray = (array) => {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const JuegoMovimiento = () => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState([null, null, null]);
  const [shuffling, setShuffling] = useState(false);
  const [correctIndex, setCorrectIndex] = useState(null);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  const currentImage = images[(level - 1) % images.length];

  useEffect(() => {
    startRound();
  }, [level]);

  const startRound = () => {
    const newCards = [currentImage, null, null];
    const shuffled = shuffleArray(newCards);
    setCards(shuffled);
    setCorrectIndex(shuffled.indexOf(currentImage));
    setSelected(null);
    setMessage("");

    setTimeout(() => {
      setShuffling(true);
      const interval = setInterval(() => {
        const reShuffle = shuffleArray(shuffled);
        setCards(reShuffle);
        setCorrectIndex(reShuffle.indexOf(currentImage));
      }, 300 / level);

      setTimeout(() => {
        clearInterval(interval);
        setShuffling(false);
      }, 2000 - level * 100);
    }, 1000);
  };

  const handleClick = (index) => {
    if (shuffling || selected !== null) return;

    setSelected(index);
    if (index === correctIndex) {
      setMessage("🎉 ¡Correcto! Siguiente nivel...");
      setTimeout(() => setLevel(level + 1), 1500);
    } else {
      setMessage("❌ Fallaste. Reiniciando...");
      setTimeout(() => setLevel(1), 1500);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Nivel {level}</h1>
      <p>Observa la carta con imagen, se mezclará. ¡Encuentra la correcta!</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem" }}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            style={{
              width: "120px",
              height: "160px",
              border: "2px solid #007bff",
              borderRadius: "12px",
              backgroundColor: "#f0f0f0",
              cursor: "pointer",
              transition: "transform 0.3s",
              boxShadow: selected === index ? "0 0 10px 3px gold" : "0 0 5px rgba(0,0,0,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {card && <img src={`/img/${card}`} alt="carta" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "1.3rem", marginTop: "1.5rem", color: message.includes("Correcto") ? "green" : "red" }}>
        {message}
      </p>
    </div>
  );
};

export default JuegoMovimiento;
