import React, { useState, useEffect } from "react";
import { getCompletedChallenges } from "../Firebase/database";
import useUsuario from "../hooks/useUsuario";
import "../css/historial.css";

const Historial = ({}) => {
  const [retosCompletados, setRetosCompletados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [ordenamiento, setOrdenamiento] = useState("reciente");
  const usuario = useUsuario();

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!usuario?.email) return;
      
      try {
        const retos = await getCompletedChallenges(usuario.email);
        setRetosCompletados(retos);
      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [usuario?.email]);

  // Filtrar retos por fecha
  const filtrarRetos = (retos) => {
    const ahora = new Date();
    
    switch (filtro) {
      case "ultima_semana":
        const unaSemanaAtras = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        return retos.filter(reto => new Date(reto.completadoEn) >= unaSemanaAtras);
      
      case "ultimo_mes":
        const unMesAtras = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
        return retos.filter(reto => new Date(reto.completadoEn) >= unMesAtras);
      
      default:
        return retos;
    }
  };

  // Ordenar retos
  const ordenarRetos = (retos) => {
    const retosOrdenados = [...retos];
    
    switch (ordenamiento) {
      case "antiguo":
        return retosOrdenados.sort((a, b) => new Date(a.completadoEn) - new Date(b.completadoEn));
      
      case "categoria":
        return retosOrdenados.sort((a, b) => a.categoria.localeCompare(b.categoria));
      
      default: // reciente
        return retosOrdenados.sort((a, b) => new Date(b.completadoEn) - new Date(a.completadoEn));
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

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opciones = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  };

  const getEstadisticas = () => {
    if (retosCompletados.length === 0) return null;

    const stats = {
      total: retosCompletados.length,
      porCategoria: {},
      porDificultad: {},
      ultimoReto: retosCompletados.reduce((ultimo, actual) => 
        new Date(actual.completadoEn) > new Date(ultimo.completadoEn) ? actual : ultimo
      )
    };

    retosCompletados.forEach(reto => {
      stats.porCategoria[reto.categoria] = (stats.porCategoria[reto.categoria] || 0) + 1;
      stats.porDificultad[reto.dificultad] = (stats.porDificultad[reto.dificultad] || 0) + 1;
    });

    return stats;
  };

  if (loading) {
    return (
      <div className="historial-container">
        <div className="loading">
          <p>Cargando tu historial...</p>
        </div>
      </div>
    );
  }

  const retosFiltrados = ordenarRetos(filtrarRetos(retosCompletados));
  const estadisticas = getEstadisticas();

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h1>Tu Historial de Retos</h1>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="estadisticas-section">
          <h2>📊 Tus Estadísticas</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{estadisticas.total}</h3>
              <p>Retos Completados</p>
            </div>
            <div className="stat-card">
              <h3>{Object.keys(estadisticas.porCategoria).length}</h3>
              <p>Categorías Exploradas</p>
            </div>
            <div className="stat-card">
              <h3>{estadisticas.porDificultad.difícil || 0}</h3>
              <p>Retos Difíciles</p>
            </div>
          </div>
          
          {/* Categorías favoritas - Solo las que tienen más de 1 reto */}
          {estadisticas.total > 1 && (
            <div className="categorias-populares">
              <h4>Tus categorías destacadas:</h4>
              <div className="categoria-tags">
                {Object.entries(estadisticas.porCategoria)
                  .filter(([categoria, cantidad]) => cantidad > 1)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5) // Máximo 5 categorías
                  .map(([categoria, cantidad]) => (
                    <span key={categoria} className="categoria-tag">
                      {categoria} ({cantidad})
                    </span>
                  ))}
              </div>
              {/* Mensaje si no hay categorías destacadas */}
              {Object.entries(estadisticas.porCategoria).filter(([,cantidad]) => cantidad > 1).length === 0 && (
                <p className="sin-destacadas">¡Sigue completando retos para ver tus categorías favoritas!</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filtros y controles */}
      <div className="controles">
        <div className="filtros">
          <label>
            Filtrar por:
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="todos">Todos los retos</option>
              <option value="ultima_semana">Última semana</option>
              <option value="ultimo_mes">Último mes</option>
            </select>
          </label>
        </div>
        
        <div className="ordenamiento">
          <label>
            Ordenar por:
            <select value={ordenamiento} onChange={(e) => setOrdenamiento(e.target.value)}>
              <option value="reciente">Más recientes</option>
              <option value="antiguo">Más antiguos</option>
              <option value="categoria">Categoría</option>
            </select>
          </label>
        </div>
      </div>

      {/* Lista de retos con scroll nativo */}
      {retosFiltrados.length === 0 ? (
        <div className="sin-retos">
          <p>
            {filtro === "todos" 
              ? "Aún no has completado ningún reto. ¡Es hora de empezar!" 
              : "No hay retos completados en este período."}
          </p>
        </div>
      ) : (
        <div className="retos-historial">
          <h3>
            {retosFiltrados.length} reto{retosFiltrados.length !== 1 ? 's' : ''} 
            {filtro !== "todos" && ` (${filtro.replace('_', ' ')})`}
          </h3>
          
          {/* Lista con scroll nativo - MÁS SIMPLE */}
          <div className="retos-lista-container">
            <div className="retos-lista">
              {retosFiltrados.map((reto, index) => (
                <div key={index} className="reto-historial-card">
                  <div className="reto-info-hi">
                    <div className="reto-titulo-fecha">
                      <h4>{reto.titulo}</h4>
                      <span className="fecha-completado">
                        {formatearFecha(reto.completadoEn)}
                      </span>
                    </div>
                    
                    <p className="reto-descripcion-hi">{reto.descripcion}</p>
                    
                    <div className="reto-meta">
                      <span className="categoria">{reto.categoria}</span>
                      <span 
                        className="dificultad"
                        style={{ backgroundColor: getDificultadColor(reto.dificultad) }}
                      >
                        {reto.dificultad}
                      </span>
                    </div>
                  </div>
                  
                  <div className="reto-status">
                    <span className="completado-badge">✓ Completado</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historial;