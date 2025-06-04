import { useState, useEffect, useRef } from "react";
import { onSignOut } from "../Firebase/auth";
import useUsuario from "../hooks/useUsuario";
import user from "../icons/user.png";
import "../css/user.css";

const CardUser = () => {
  const usuario = useUsuario();
  const [expanded, setExpanded] = useState(false); // Para expandir/contraer info básica
  const [menuOpen, setMenuOpen] = useState(false); // Para el menú de opciones
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
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Función para expandir/contraer la info básica al hacer clic en la foto
  const toggleExpanded = () => {
    setExpanded(!expanded);
    setMenuOpen(false); // Cerrar menú si está abierto
  };

  // Función para el menú de opciones (tres puntos)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div  title="Usuario"  className="container-user" ref={menuRef}>
      <img
        className="usuario"
        src={usuario?.avatar || user}
        alt={usuario?.email || "Usuario"}
        onClick={toggleExpanded}
        style={{ cursor: 'pointer' }}
      />

      {expanded && (
        <>
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

          <button className="menu-btn" onClick={toggleMenu}>
            ⋮
          </button>
        </>
      )}
    </div>
  );
};

export default CardUser;
