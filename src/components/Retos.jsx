import React, { useState, useEffect, useRef } from "react";
import { generarReto, obtenerRetosRelacionados } from "../utils/generarRetos";
import useUsuario from "../hooks/useUsuario";
import { saveCompletedChallenge, getCompletedChallenges } from "../Firebase/database";
import "../css/retos.css";

const Retos = ({ quizAnswers, onBack}) => {
  const [retoActual, setRetoActual] = useState(null);
  const [retosRelacionados, setRetosRelacionados] = useState([]);
  const [retosCompletados, setRetosCompletados] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingRetos, setLoadingRetos] = useState(true);
  const usuario = useUsuario();
    
  
  // Referencias para el carrusel
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Función para obtener retos completados desde Firebase
  const obtenerRetosCompletados = async () => {
    if (!usuario?.email) return;
    
    try {
      const retosFromDB = await getCompletedChallenges(usuario.email);
      const idsCompletados = retosFromDB.map(reto => generarIdReto(reto));
      setRetosCompletados(new Set(idsCompletados));
      
    } catch (error) {
      console.error("Error obteniendo retos completados:", error);
    } finally {
      setLoadingRetos(false);
    }
  };

  useEffect(() => {
    console.log("Retos - quizAnswers recibidas:", quizAnswers); // Debug
    
    if (quizAnswers) {
      try {
        const reto = generarReto(quizAnswers);
        console.log("Reto generado:", reto); // Debug
        setRetoActual(reto);
        
        // Obtener retos relacionados
        const relacionados = obtenerRetosRelacionados(reto);
        console.log("Retos relacionados:", relacionados); // Debug
        setRetosRelacionados(relacionados);
      } catch (error) {
        console.error("Error generando reto:", error);
      }
    }
  }, [quizAnswers]);

  // Cargar retos completados cuando el usuario esté disponible
  useEffect(() => {
    if (usuario?.email) {
      obtenerRetosCompletados();
    }
  }, [usuario?.email]);

  // Función para generar un ID único para cada reto
  const generarIdReto = (reto) => {
    return `${reto.titulo}-${reto.categoria}-${reto.dificultad}`.toLowerCase().replace(/\s+/g, '-');
  };

  // Verificar si el reto actual está completado
  const retoActualCompletado = retoActual ? retosCompletados.has(generarIdReto(retoActual)) : false;

  // Función para actualizar el estado de los botones de scroll
  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Función para scroll suave hacia la izquierda
  const scrollLeft = () => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Ancho de una card + gap
      carouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Función para scroll suave hacia la derecha
  const scrollRight = () => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Ancho de una card + gap
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Effect para actualizar botones cuando cambian los retos relacionados
  useEffect(() => {
    if (retosRelacionados.length > 0) {
      // Pequeño delay para que el DOM se actualice
      setTimeout(updateScrollButtons, 100);
    }
  }, [retosRelacionados]);

  const handleCompletarReto = async () => {
    if (!usuario?.email || !retoActual) return;

    setLoading(true);
    try {
      await saveCompletedChallenge(usuario.email, {
        ...retoActual,
        completadoEn: new Date().toISOString(),
        usuario: usuario.username || "Anónimo",
        userEmail: usuario.email // Asegúrate de incluir el email para las consultas
      });
      
      // Actualizar el estado local inmediatamente
      const idReto = generarIdReto(retoActual);
      setRetosCompletados(prev => new Set([...prev, idReto]));
      
      console.log("Reto completado y guardado");
    } catch (error) {
      console.error("Error guardando reto completado:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoReto = (nuevoReto) => {
    setRetoActual(nuevoReto);
    
    // Actualizar retos relacionados
    const relacionados = obtenerRetosRelacionados(nuevoReto);
    setRetosRelacionados(relacionados);
  };

  const handleBackClick = () => {
    console.log("Botón Volver clickeado"); // Debug
    if (onBack) {
      onBack();
    }
  };

  const getDificultadColor = (dificultad) => {
    switch (dificultad) {
      case 'fácil': return '#4CAF50';
      case 'medio': return '#FF9800';
      case 'difícil': return '#F44336';
      default: return '#2196F3';
    }
  };

  // Debug: mostrar estado actual
  console.log("Retos - Estado actual:", {
    quizAnswers,
    retoActual,
    usuario: usuario?.email,
    retosCompletados: Array.from(retosCompletados)
  });

  if (loadingRetos) {
    return (
      <div className="retos-container">
        <div className="retos-loading">
          <p>Cargando tus retos...</p>
        </div>
      </div>
    );
  }

  if (!retoActual) {
    return (
      <div className="retos-container">
        <div className="retos-loading">
          <p>Generando tu reto personalizado...</p>
          <p>Quiz Answers: {JSON.stringify(quizAnswers)}</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="retos-container">
        <div className="retos-header">
          <button onClick={handleBackClick} className="btn-back">
            ← Volver
          </button>
                
          <h1>Tu Reto Personalizado</h1>
        </div>

        <div className="reto-principal">
          
          <div className="reto-card">
            
            <div className="reto-header">
              <h2>{retoActual.titulo}</h2>
              
              <div className="reto-meta">
                <span className="categoria">{retoActual.categoria}</span>
                <span 
                  className="dificultad" 
                  style={{ backgroundColor: getDificultadColor(retoActual.dificultad) }}
                >
                  {retoActual.dificultad}
                </span>
              </div>
            </div>
            
            <p className="reto-descripcion">{retoActual.descripcion}</p>
            
            <div className="reto-info">
              <span className="fecha">📅 {retoActual.fecha}</span>
            </div>

            <div className="reto-acciones">
              {!retoActualCompletado ? (
                <button 
                  onClick={handleCompletarReto}
                  disabled={loading}
                  className="btn-completar"
                >
                  {loading ? "Guardando..." : "✓ Completar Reto"}
                </button>
              ) : (
                <div className="reto-completado">
                  <span className="mensaje-exito">🎉 ¡Reto completado! ¡Bien hecho!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {retosRelacionados.length > 0 && (
          <div className="retos-relacionados">
            <h3>Otros retos que te pueden interesar</h3>
            <div className="retos-carousel-container">
              {/* Botón scroll izquierda */}
              <button 
                className="carousel-nav-btn prev"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                aria-label="Scroll hacia la izquierda"
              >
                ‹
              </button>

              {/* Botón scroll derecha */}
              <button 
                className="carousel-nav-btn next"
                onClick={scrollRight}
                disabled={!canScrollRight}
                aria-label="Scroll hacia la derecha"
              >
                ›
              </button>

              {/* Carrusel de retos */}
              <div 
                className="retos-carousel-wrapper"
                ref={carouselRef}
                onScroll={updateScrollButtons}
              >
                <div className="retos-grid">
                  {retosRelacionados.map((reto, index) => {
                    const isCompletado = retosCompletados.has(generarIdReto(reto));
                    return (
                      <div key={index} className="reto-card-mini">
                        <h4>{reto.titulo}</h4>
                        <p className="descripcion-mini">{reto.descripcion}</p>
                        <div className="reto-meta-mini">
                          <span className="categoria-mini">{reto.categoria}</span>
                          <span 
                            className="dificultad-mini"
                            style={{ backgroundColor: getDificultadColor(reto.dificultad) }}
                          >
                            {reto.dificultad}
                          </span>
                          {isCompletado && (
                            <span className="completado-badge">✓</span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleNuevoReto(reto)}
                          className="btn-probar"
                        >
                          {isCompletado ? "Ver reto completado" : "Probar este reto"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Indicador opcional */}
            {retosRelacionados.length > 3 && (
              <div className="scroll-indicator">
                Desliza para ver más retos →
              </div>
            )}
          </div>
        )}
      </div>
  </div>
  );
};

export default Retos;