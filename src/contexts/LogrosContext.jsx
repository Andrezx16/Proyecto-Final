import React, { createContext, useContext, useState, useCallback } from 'react';

const LogrosContext = createContext();

export const useLogros = () => {
  const context = useContext(LogrosContext);
  if (!context) {
    throw new Error('useLogros debe ser usado dentro de LogrosProvider');
  }
  return context;
};

export const LogrosProvider = ({ children }) => {
  const [notificacionesQueue, setNotificacionesQueue] = useState([]);
  const [notificacionActual, setNotificacionActual] = useState(null);
  const [mostrandoNotificacion, setMostrandoNotificacion] = useState(false);

  // Definición de logros (movida desde Logros.jsx)
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

  // Verificar nuevos logros desbloqueados
  const verificarNuevosLogros = useCallback((retosCompletados, logrosAnteriores = new Set()) => {
    const nuevosLogros = [];
    
    logrosDisponibles.forEach(logro => {
      if (logro.condicion(retosCompletados) && !logrosAnteriores.has(logro.id)) {
        nuevosLogros.push(logro);
      }
    });

    if (nuevosLogros.length > 0) {
      // Agregar nuevos logros a la cola de notificaciones
      setNotificacionesQueue(prev => [...prev, ...nuevosLogros]);
    }

    return nuevosLogros;
  }, [logrosDisponibles]);

  // Mostrar siguiente notificación
  const mostrarSiguienteNotificacion = useCallback(() => {
    if (notificacionesQueue.length > 0 && !mostrandoNotificacion) {
      const siguienteLogro = notificacionesQueue[0];
      setNotificacionActual(siguienteLogro);
      setMostrandoNotificacion(true);
      setNotificacionesQueue(prev => prev.slice(1));
    }
  }, [notificacionesQueue, mostrandoNotificacion]);

  // Cerrar notificación actual
  const cerrarNotificacion = useCallback(() => {
    setMostrandoNotificacion(false);
    setTimeout(() => {
      setNotificacionActual(null);
      // Mostrar siguiente notificación si hay más en la cola
      if (notificacionesQueue.length > 0) {
        setTimeout(() => {
          mostrarSiguienteNotificacion();
        }, 500);
      }
    }, 300);
  }, [notificacionesQueue, mostrarSiguienteNotificacion]);

  // Efecto para mostrar notificaciones automáticamente
  React.useEffect(() => {
    mostrarSiguienteNotificacion();
  }, [mostrarSiguienteNotificacion]);

  const contextValue = {
    logrosDisponibles,
    notificacionActual,
    mostrandoNotificacion,
    verificarNuevosLogros,
    cerrarNotificacion,
    // Función helper para calcular logros desbloqueados
    calcularLogrosDesbloqueados: (retosCompletados) => {
      const desbloqueados = new Set();
      logrosDisponibles.forEach(logro => {
        if (logro.condicion(retosCompletados)) {
          desbloqueados.add(logro.id);
        }
      });
      return desbloqueados;
    }
  };

  return (
    <LogrosContext.Provider value={contextValue}>
      {children}
    </LogrosContext.Provider>
  );
};

export default LogrosContext;