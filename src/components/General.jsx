import React, { useState } from "react";
import Retos from "./Retos"; 
import { FaHome, FaGamepad, FaHistory } from "react-icons/fa";
import "../css/General.css";
import Juegos from "./Juegos";
import Historial from "./Historial"

const General = ({ quizAnswers, onBack }) => {
  const [selected, setSelected] = useState("retos");

  const renderContent = () => {
    switch (selected) {
      case "retos":
        return <Retos quizAnswers={quizAnswers} onBack={onBack} />;
      case "game":
        return <Juegos />;
      case "history":
        return <Historial/>;
      default:
        return null;
    }
  };

  return (
    <div className="general-container">
      <div className="sidebar">
        <div className="icon" onClick={() => setSelected("retos")}>
          <FaHome />
        </div>
        <div className="icon" onClick={() => setSelected("game")}>
          <FaGamepad />
        </div>
        <div className="icon" onClick={() => setSelected("history")}>
          <FaHistory />
        </div>
      </div>
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default General;
