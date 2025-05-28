import React from "react";
import "../css/bienvenida.css"; // Importa el CSS

const Bienvenida = ({ onStart }) => {
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
      >
        Empezar Retos
      </button>
    </div>
  );
};

export default Bienvenida;
