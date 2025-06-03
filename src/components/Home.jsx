import React, { useEffect, useState } from "react";
import useUsuario from "../hooks/useUsuario";
import CardUser from "./CardUser";
import Quiz from "./Quiz";
import { onSignOut } from "../Firebase/auth";
import General from "./General";
import Bienvenida from "./Bienvenida";
import { hasCompletedQuiz, getQuizAnswers } from "../Firebase/database";
import "../css/login.css";

const Home = () => {
  const usuario = useUsuario();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showBienvenida, setShowBienvenida] = useState(false);
  const [showGeneral, setShowGeneral] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const verificarQuiz = async () => {
      if (usuario?.email) {
        const yaRespondio = await hasCompletedQuiz(usuario.email);

        if (!yaRespondio) {
          // Si no ha respondido el quiz, mostrarlo
          setShowQuiz(true);
        } else {
          // Si ya respondió, obtener las respuestas guardadas y mostrar bienvenida
          const respuestas = await getQuizAnswers(usuario.email);
          setQuizAnswers(respuestas);
          setShowBienvenida(true);
        }

        setReady(true);
      }
    };

    verificarQuiz();
  }, [usuario]);

  // Cuando termina el quiz
  const handleQuizFinish = (answers) => {
    setQuizAnswers(answers);
    setShowQuiz(false);
    setShowBienvenida(true);
  };

  // Cuando hace clic en "Empezar Retos" en Bienvenida
  const handleBienvenidaStart = () => {
    setShowBienvenida(false);
    setShowGeneral(true);
  };

  // Cuando hace clic en "Volver" en Retos
  const handleRetosBack = () => {
    setShowGeneral(false);
    setShowBienvenida(true);
  };

  // Loading state
  if (!ready) return null;

  return (
    <div className="login">
      <CardUser />
      <button
        className="cerrar-sesion-flotante"
        title="Cerrar sesión"
        onClick={onSignOut}
      >
        ❌
      </button>

      <div className="decoration"></div>
      <div className="decorationl"></div>

      {/* Mostrar Quiz si no ha respondido */}
      {showQuiz && <Quiz onFinish={handleQuizFinish} />}

      {/* Mostrar Bienvenida después del quiz o si ya respondió antes */}
      {showBienvenida && <Bienvenida onStart={handleBienvenidaStart} />}

      {/* Mostrar Retos cuando hace clic en "Empezar Retos" */}
      {showGeneral && quizAnswers && (
        <General quizAnswers={quizAnswers} onBack={handleRetosBack} />
      )}
      <img className="bubbles" src="/img/bubbles.png" alt="burbujas" />
    </div>
  );
};

export default Home;
