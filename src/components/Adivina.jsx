import React, { useState } from "react";
import "../css/Adivina.css"

const words = [
  {
    word: "feliz",
    description: "Estado emocional positivo que se experimenta al sentirse satisfecho, pleno o afortunado."
  },
  {
    word: "triste",
    description: "Emoción que aparece ante la pérdida, el dolor o situaciones difíciles que afectan el ánimo."
  },
  {
    word: "agotado",
    description: "Sensación de cansancio extremo, tanto físico como mental, a menudo causada por el estrés o exceso de actividad."
  },
  {
    word: "frustrado",
    description: "Emoción que surge cuando los deseos, metas o expectativas no se cumplen como se esperaba."
  },
  {
    word: "emocionado",
    description: "Estado de entusiasmo o alegría intensa ante una situación especial o esperada."
  },
  {
    word: "ansioso",
    description: "Sentimiento de inquietud o preocupación frente a lo desconocido o situaciones de incertidumbre."
  },
  {
    word: "enojado",
    description: "Reacción emocional intensa frente a algo que se percibe como injusto, molesto o amenazante."
  },
  {
    word: "sorprendido",
    description: "Emoción súbita ante algo inesperado, que puede ser positivo o negativo."
  },
  {
    word: "contento",
    description: "Sensación de bienestar y tranquilidad asociada con la satisfacción personal."
  },
  {
    word: "aburrido",
    description: "Estado de desinterés o falta de estímulo que puede llevar a la búsqueda de nuevas ideas o actividades."
  }
];

const HangmanDrawing = ({ wrongGuesses }) => {
  return (
    <svg height="250" width="200" style={{ marginBottom: "20px" }}>
      <line x1="10" y1="230" x2="150" y2="230" stroke="black" strokeWidth="4" />
      <line x1="40" y1="20" x2="40" y2="230" stroke="black" strokeWidth="4" />
      <line x1="40" y1="20" x2="120" y2="20" stroke="black" strokeWidth="4" />
      <line x1="120" y1="20" x2="120" y2="50" stroke="black" strokeWidth="4" />
      {wrongGuesses > 0 && <circle cx="120" cy="70" r="20" stroke="black" strokeWidth="4" fill="none" />}
      {wrongGuesses > 1 && <line x1="120" y1="90" x2="120" y2="150" stroke="black" strokeWidth="4" />}
      {wrongGuesses > 2 && <line x1="120" y1="100" x2="90" y2="130" stroke="black" strokeWidth="4" />}
      {wrongGuesses > 3 && <line x1="120" y1="100" x2="150" y2="130" stroke="black" strokeWidth="4" />}
      {wrongGuesses > 4 && <line x1="120" y1="150" x2="100" y2="190" stroke="black" strokeWidth="4" />}
      {wrongGuesses > 5 && <line x1="120" y1="150" x2="140" y2="190" stroke="black" strokeWidth="4" />}
    </svg>
  );
};

const App = () => {
  const [currentWord, setCurrentWord] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;

  const handleLetterClick = (letter) => {
    if (guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);

    if (!currentWord.word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
    }
  };

  const isWinner = currentWord.word.split("").every((letter) => guessedLetters.includes(letter));
  const isLoser = wrongGuesses >= maxWrong;

  const resetGame = () => {
    const newWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(newWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  return (
    <div className="container-adivina"  style={{ textAlign: "center", fontFamily: "Arial", padding: "2rem" }}>
      <h1>Adivina</h1>

      {/* Instrucciones solamente */}
      <p className="info-adivina"  style={{
        maxWidth: "700px",
        margin: "0 auto 1rem",
        fontSize: "1.15rem",
        color: "#003366",
        lineHeight: "1.6"
      }}>
        <strong>Pon a prueba tu ingenio</strong> eligiendo las letras correctas para descubrir la palabra oculta.
        <strong> ¡Pero cuidado!</strong> Solo tienes <strong>{maxWrong} intentos</strong> antes de que el juego llegue a su fin.
      </p>

      <HangmanDrawing wrongGuesses={wrongGuesses} />
      <p>Errores: {wrongGuesses} / {maxWrong}</p>

      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        {currentWord.word.split("").map((letter, index) => (
          <span key={index} style={{ marginRight: "10px" }}>
            {guessedLetters.includes(letter) || isLoser ? letter : "_"}
          </span>
        ))}
      </div>

      {/* Descripción de la palabra (solo abajo) */}
      <p className="info-adivina"  style={{
        fontSize: "1.1rem",
        fontStyle: "italic",
        color: "#003366",
        maxWidth: "700px",
        margin: "0 auto 1.5rem",
        textAlign: "justify"
      }}>
        {currentWord.description}
      </p>

      {/* Letras del abecedario */}
      <div className="abecedario"  style={{ marginBottom: "1rem" }}>
        {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            disabled={guessedLetters.includes(letter) || isWinner || isLoser}
            style={{
              margin: "3px",
              padding: "8px",
              width: "30px",
              backgroundColor: guessedLetters.includes(letter)
                ? currentWord.word.includes(letter)
                  ? "lightgreen"
                  : "lightcoral"
                : "#eee",
              color: "#007bff", // letras en azul
              cursor: "pointer",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {(isWinner || isLoser) && (
        <div style={{ fontSize: "1.5rem", marginTop: "1rem" }}>
          {isWinner ? "🎉 ¡Ganaste!" : `💀 Perdiste. La palabra era: ${currentWord.word}`}
          <br />
          <button onClick={resetGame} style={{ marginTop: "10px", padding: "10px 20px" }}>
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
