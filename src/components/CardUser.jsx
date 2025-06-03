import { useState, useEffect, useRef } from "react";
import { onSignOut } from "../Firebase/auth";
import useUsuario from "../hooks/useUsuario";
import user from "../icons/user.png";
import "../css/user.css";

const CardUser = () => {
  const usuario = useUsuario();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

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

  const cerrarSesion = async () => {
    try {
      await onSignOut();
      window.location.href = "/login"; // ✅ Redirección directa
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="container" ref={menuRef}>
      <img
        className="usuario"
        src={usuario?.avatar || user}
        alt={usuario?.email || "Usuario"}
      />

      <div className="info">
        {!menuOpen ? (
          <>
            <span className="name">{usuario?.username || "Sin Nombre"}</span>
            <span className="email">{usuario?.email || "usuario"}</span>
          </>
        ) : (
          <div className="menu-options">
            <button onClick={cerrarSesion}>❌ Cerrar Sesión</button>
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
