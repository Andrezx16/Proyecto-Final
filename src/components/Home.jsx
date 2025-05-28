import React, { useEffect, useState } from "react";
import useUsuario from "../hooks/useUsuario";
import CardUser from "./CardUser";
import Quiz from "./Quiz";
import { hasCompletedQuiz } from "../Firebase/database"; // 👈 importa esto
import "../css/login.css";
import Bienvenida from "./Bienvenida";

const Home = () => {
  const usuario = useUsuario();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showBienvenida, setShowBienvenida] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const verificarQuiz = async () => {
      if (usuario?.email) {
        const yaRespondio = await hasCompletedQuiz(usuario.email);

        if (!yaRespondio) {
          setShowQuiz(true);
        } else {
          setShowBienvenida(true);
        }

        setReady(true);
      }
    };

    verificarQuiz();
  }, [usuario]);

  if (!ready) return null;

  return (
    <div className="login">
      <nav className="carduser">
        <CardUser />
      </nav>
      <div className="decoration"></div>
      <div className="decorationl"></div>
      {showQuiz && (
        <Quiz
          onFinish={() => {
            setShowQuiz(false);
            setShowBienvenida(true);
          }}
        />
      )}

      {showBienvenida && (
        <Bienvenida
          onStart={() => {
            setShowBienvenida(false);
          }}
        />
      )}
      <img className="bubbles" src="/img/bubbles.png" alt="burbujas" />
    </div>
  );
};

export default Home;
