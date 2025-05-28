import { useState, useEffect, useRef } from "react";
import { onSignOut } from "../Firebase/auth";
import { deleteQuizAnswers } from "../Firebase/database";
import useUsuario from "../hooks/useUsuario";
import user from "../icons/user.png";
import "../css/user.css";

const CardUser = () => {
  const usuario = useUsuario();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  const reiniciarQuiz = async () => {
    try {
      await deleteQuizAnswers(usuario.email);
      window.location.reload();
    } catch (error) {
      console.error("Error al reiniciar el quiz:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="container" ref={menuRef}>
      {usuario?.avatar ? (
        <img className="usuario" src={usuario?.avatar} alt={usuario?.email} />
      ) : (
        <img className="usuario" src={user} width={80} />
      )}
      <div className="info">
        {!menuOpen && (
          <>
            <span className="name">{usuario?.username || "Sin Nombre"}</span>
            <span className="email">{usuario?.email || "usuario"}</span>
          </>
        )}
        {menuOpen && (
          <div className="menu-options">
            <button onClick={reiniciarQuiz}>🔄 Rehacer Quiz</button>
            <button onClick={onSignOut}>❌ Cerrar Sesión</button>
          </div>
        )}
      </div>
      <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
        ⋮
      </button>
    </div>
  );
};

export default CardUser;
