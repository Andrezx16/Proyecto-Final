import React, { useState } from "react";
import Retos from "./Retos"; 
import Logros from "./Logros";
import { FaHome, FaGamepad, FaHistory, FaTrophy } from "react-icons/fa";
import "../css/General.css";
import Juegos from "./Juegos";
import Historial from "./Historial";
import { LogrosProvider, useLogros } from "../contexts/LogrosContext";
import LogroNotification from "./LogroNotification";

// Componente interno que usa el context
const GeneralContent = ({ quizAnswers, onBack }) => {
  const [selected, setSelected] = useState("retos");
  const { notificacionActual, mostrandoNotificacion, cerrarNotificacion } = useLogros();

  const renderContent = () => {
    switch (selected) {
      case "retos":
        return <Retos quizAnswers={quizAnswers} onBack={onBack} />;
      case "game":
        return <Juegos />;
      case "history":
        return <Historial />;
      case "logros":
        return <Logros />;
      default:
        return null;
    }
  };

  return (
    <div className="general-container">
      <div className="sidebar">
        <div 
          className={`icon ${selected === "retos" ? "active" : ""}`}
          onClick={() => setSelected("retos")}
          title="Retos"
        >
          <FaHome />
        </div>
        <div 
          className={`icon ${selected === "game" ? "active" : ""}`}
          onClick={() => setSelected("game")}
          title="Juegos"
        >
          <FaGamepad />
        </div>
        <div 
          className={`icon ${selected === "history" ? "active" : ""}`}
          onClick={() => setSelected("history")}
          title="Historial"
        >
          <FaHistory />
        </div>
        <div 
          className={`icon ${selected === "logros" ? "active" : ""}`}
          onClick={() => setSelected("logros")}
          title="Logros y Recompensas"
        >
          <FaTrophy />
        </div>
      </div>
      
      <div className="main-content">
        {renderContent()}
      </div>

      {/* Notificación de logro */}
      {notificacionActual && (
        <LogroNotification
          logro={notificacionActual}
          isVisible={mostrandoNotificacion}
          onClose={cerrarNotificacion}
        />
      )}
    </div>
  );
};

// Componente principal que provee el context
const General = ({ quizAnswers, onBack }) => {
  return (
    <LogrosProvider>
      <GeneralContent quizAnswers={quizAnswers} onBack={onBack} />
    </LogrosProvider>
  );
};

export default General;