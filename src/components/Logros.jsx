import React, { useState, useEffect } from "react";
import useUsuario from "../hooks/useUsuario";
import { getCompletedChallenges } from "../Firebase/database";
import "../css/logros.css";

const Logros = () => {
  const [retosCompletados, setRetosCompletados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logrosDesbloqueados, setLogrosDesbloqueados] = useState(new Set());
  const usuario = useUsuario();

  // Definición de logros disponibles
  const logrosDisponibles = [
    {
      id: 'primer_reto',
      titulo: 'Primer Paso',
      descripcion: 'Completa tu primer reto',
      icono: '🎯',
      condicion: (retos) => retos.length >= 1,
      puntos: 10,
      categoria: 'iniciacion'
    },
    {
      id: 'cinco_retos',
      titulo: 'Constante',
      descripcion: 'Completa 5 retos',
      icono: '🔥',
      condicion: (retos) => retos.length >= 5,
      puntos: 25,
      categoria: 'consistencia'
    },
    {
      id: 'diez_retos',
      titulo: 'Dedicado',
      descripcion: 'Completa 10 retos',
      icono: '⭐',
      condicion: (retos) => retos.length >= 10,
      puntos: 50,
      categoria: 'consistencia'
    },
    {
      id: 'reto_dificil',
      titulo: 'Desafío Extremo',
      descripcion: 'Completa un reto difícil',
      icono: '💪',
      condicion: (retos) => retos.some(reto => reto.dificultad === 'difícil'),
      puntos: 30,
      categoria: 'dificultad'
    },
    {
      id: 'explorador',
      titulo: 'Explorador',
      descripcion: 'Completa retos de 3 categorías diferentes',
      icono: '🗺️',
      condicion: (retos) => {
        const categorias = new Set(retos.map(reto => reto.categoria));
        return categorias.size >= 3;
      },
      puntos: 35,
      categoria: 'variedad'
    },
    {
      id: 'racha_semanal',
      titulo: 'Racha Semanal',
      descripcion: 'Completa retos durante 7 días seguidos',
      icono: '📅',
      condicion: (retos) => {
        // Lógica simplificada - en producción sería más compleja
        return retos.length >= 7;
      },
      puntos: 40,
      categoria: 'constancia'
    },
    {
      id: 'maestro',
      titulo: 'Maestro de Retos',
      descripcion: 'Completa 20 retos',
      icono: '👑',
      condicion: (retos) => retos.length >= 20,
      puntos: 100,
      categoria: 'maestria'
    }
  ];

  // Cargar retos completados
  useEffect(() => {
    const cargarRetos = async () => {
      if (!usuario?.email) return;
      
      try {
        const retos = await getCompletedChallenges(usuario.email);
        setRetosCompletados(retos);
        
        // Verificar logros desbloqueados
        const nuevosLogros = new Set();
        logrosDisponibles.forEach(logro => {
          if (logro.condicion(retos)) {
            nuevosLogros.add(logro.id);
          }
        });
        setLogrosDesbloqueados(nuevosLogros);
        
      } catch (error) {
        console.error("Error cargando retos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarRetos();
  }, [usuario?.email]);

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const totalRetos = retosCompletados.length;
    const totalPuntos = Array.from(logrosDesbloqueados)
      .map(id => logrosDisponibles.find(l => l.id === id)?.puntos || 0)
      .reduce((total, puntos) => total + puntos, 0);
    
    const categorias = new Set(retosCompletados.map(reto => reto.categoria));
    const retosPorDificultad = {
      facil: retosCompletados.filter(r => r.dificultad === 'fácil').length,
      medio: retosCompletados.filter(r => r.dificultad === 'medio').length,
      dificil: retosCompletados.filter(r => r.dificultad === 'difícil').length
    };

    return {
      totalRetos,
      totalPuntos,
      categorias: categorias.size,
      retosPorDificultad,
      progreso: Math.min((totalRetos / 20) * 100, 100) // Progreso hacia maestría
    };
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return (
      <div className="logros-container">
        <div className="loading-logros">
          <h2>Cargando tus logros...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="logros-container">
      <div className="logros-header">
        <h1>🏆 Logros y Recompensas</h1>
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-number">{stats.totalRetos}</span>
            <span className="stat-label">Retos Completados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.totalPuntos}</span>
            <span className="stat-label">Puntos Ganados</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{logrosDesbloqueados.size}</span>
            <span className="stat-label">Logros Desbloqueados</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso general */}
      <div className="progreso-general">
        <h3>Progreso hacia la Maestría</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.progreso}%` }}
          ></div>
        </div>
        <span className="progress-text">{Math.round(stats.progreso)}% completado</span>
      </div>

      {/* Estadísticas detalladas */}
      <div className="estadisticas-detalladas">
        <h3>📊 Estadísticas Detalladas</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Categorías Exploradas</h4>
            <span className="big-number">{stats.categorias}</span>
          </div>
          <div className="stat-card">
            <h4>Retos Fáciles</h4>
            <span className="big-number green">{stats.retosPorDificultad.facil}</span>
          </div>
          <div className="stat-card">
            <h4>Retos Medios</h4>
            <span className="big-number orange">{stats.retosPorDificultad.medio}</span>
          </div>
          <div className="stat-card">
            <h4>Retos Difíciles</h4>
            <span className="big-number red">{stats.retosPorDificultad.dificil}</span>
          </div>
        </div>
      </div>

      {/* Logros */}
      <div className="logros-section">
          <h3>🎖️ Logros Disponibles</h3>
          <div className="logros-grid">
            {logrosDisponibles.map(logro => {
              const desbloqueado = logrosDesbloqueados.has(logro.id);
              return (
                <div 
                  key={logro.id} 
                  className={`logro-card ${desbloqueado ? 'desbloqueado' : 'bloqueado'}`}
                >
                  <div className="logro-icono">
                    {desbloqueado ? logro.icono : '🔒'}
                  </div>
                  <div className="logro-info">
                    <h4 className={`logro-titulo ${!desbloqueado ? 'bloqueado-text' : ''}`}>
                      {desbloqueado ? logro.titulo : '???'}
                    </h4>
                    <p className={`logro-descripcion ${!desbloqueado ? 'bloqueado-text' : ''}`}>
                      {desbloqueado ? logro.descripcion : 'Logro por desbloquear'}
                    </p>
                    <div className="logro-puntos">
                      <span className="puntos">+{logro.puntos} pts</span>
                      <span className={`categoria-badge ${logro.categoria}`}>
                        {logro.categoria}
                      </span>
                    </div>
                  </div>
                  {desbloqueado && (
                    <div className="logro-completado">
                      <span className="check-mark">✓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      {/* Próximos logros */}
      <div className="proximos-logros">
        <h3>🎯 Próximos Logros</h3>
        <div className="siguiente-logro">
          {logrosDisponibles
            .filter(logro => !logrosDesbloqueados.has(logro.id))
            .slice(0, 3)
            .map(logro => (
              <div key={logro.id} className="siguiente-logro-item">
                <span className="logro-icono-pequeno">{logro.icono}</span>
                <div className="logro-info-pequena">
                  <strong>{logro.titulo}</strong>
                  <p>{logro.descripcion}</p>
                </div>
                <span className="puntos-pequenos">+{logro.puntos}pts</span>
              </div>
            ))}
        </div>
      </div>

      {/* Mensaje motivacional */}
      {stats.totalRetos === 0 && (
        <div className="mensaje-motivacional">
          <h3>🚀 ¡Comienza tu aventura!</h3>
          <p>Completa tu primer reto para desbloquear tu primer logro y comenzar a ganar puntos.</p>
        </div>
      )}
    </div>
  );
};

export default Logros;