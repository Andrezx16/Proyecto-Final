import React from "react";
import { deleteQuizAnswers } from "../Firebase/database";
import useUsuario from "../hooks/useUsuario";
import "../css/bienvenida.css";

const Bienvenida = ({ onStart }) => {
  const usuario = useUsuario();
  const reiniciarQuiz = async () => {
    try {
      await deleteQuizAnswers(usuario.email);
      window.location.reload();
    } catch (error) {
      console.error("Error al reiniciar el quiz:", error);
    }
  };
  const handleStartClick = () => {
    console.log("Botón Empezar Retos clickeado"); 
    if (onStart) {
      onStart();
    }
  };


  return (
    <div className="bienvenida-container">
      <img 
        src="/logo/logo.png" 
        alt="Logo Quirkly"
        className="bienvenida-logo"
      />
      <h1 className="bienvenida-title">¡Bienvenido a Quirkly!</h1>
      <p className="bienvenida-text">
        Te ayudaremos a descubrir pequeños retos diarios personalizados para mejorar tus habilidades, tu estado de ánimo y tu disciplina. 🌟
      </p>
      <div className="bienvenida-subtext-container">
        <p className="bienvenida-subtext">Basado en tu quiz, tenemos retos especialmente diseñados para ti.</p>
      </div>
      <button 
        className="bienvenida-button"
        onClick={handleStartClick}
      >
        Empezar Retos
      </button>
      <button 
        className="bienvenida-button" 
        onClick={reiniciarQuiz}
        title="Rehacer Quiz"
      >
        Rehacer quiz
      </button>
    </div>
  );
};

export default Bienvenida;