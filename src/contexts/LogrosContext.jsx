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
  const [notificationManager, setNotificationManager] = useState(null);

  // Funciones helper para verificaciones de tiempo
  const esMismoDia = (fecha1, fecha2) => {
    const d1 = new Date(fecha1);
    const d2 = new Date(fecha2);
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const verificarRachaSemanal = (retos) => {
    if (retos.length < 7) return false;

    // Ordenar retos por fecha
    const retosOrdenados = retos
      .map(reto => new Date(reto.completedOn))
      .sort((a, b) => a - b);

    // Verificar si hay 7 días consecutivos con al menos un reto cada día
    let diasConsecutivos = 1;
    let fechaAnterior = retosOrdenados[0];

    for (let i = 1; i < retosOrdenados.length; i++) {
      const fechaActual = retosOrdenados[i];
      const diferenciaDias = Math.floor((fechaActual - fechaAnterior) / (1000 * 60 * 60 * 24));

      if (diferenciaDias === 1) {
        diasConsecutivos++;
        if (diasConsecutivos >= 7) return true;
      } else if (diferenciaDias > 1) {
        diasConsecutivos = 1;
      }
      
      fechaAnterior = fechaActual;
    }

    return false;
  };

  const contarRetosEnDia = (retos, fecha = new Date()) => {
    return retos.filter(reto => esMismoDia(reto.completedOn, fecha)).length;
  };

  const verificarHorarioNocturno = (retos) => {
    return retos.some(reto => {
      const fecha = new Date(reto.completedOn);
      const hora = fecha.getHours();
      return hora >= 0 && hora < 6; // Entre medianoche y 6 AM
    });
  };

  const verificarHorarioMadrugador = (retos) => {
    return retos.some(reto => {
      const fecha = new Date(reto.completedOn);
      const hora = fecha.getHours();
      return hora >= 5 && hora < 7; // Entre 5 AM y 7 AM
    });
  };

  // Definición expandida de logros con verificaciones de tiempo reales
  const logrosDisponibles = [
    // LOGROS DE INICIACIÓN
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
      id: 'bienvenido',
      titulo: 'Bienvenido',
      descripcion: 'Completa 3 retos para familiarizarte',
      icono: '👋',
      condicion: (retos) => retos.length >= 3,
      puntos: 15,
      categoria: 'iniciacion'
    },

    // LOGROS DE CONSISTENCIA
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
      id: 'quince_retos',
      titulo: 'Comprometido',
      descripcion: 'Completa 15 retos',
      icono: '💎',
      condicion: (retos) => retos.length >= 15,
      puntos: 75,
      categoria: 'consistencia'
    },
    {
      id: 'racha_semanal',
      titulo: 'Racha Semanal',
      descripcion: 'Completa retos durante 7 días seguidos',
      icono: '📅',
      condicion: (retos) => verificarRachaSemanal(retos),
      puntos: 40,
      categoria: 'consistencia'
    },

    // LOGROS DE DIFICULTAD
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
      id: 'tres_retos_dificiles',
      titulo: 'Guerrero',
      descripcion: 'Completa 3 retos difíciles',
      icono: '⚔️',
      condicion: (retos) => retos.filter(reto => reto.dificultad === 'difícil').length >= 3,
      puntos: 60,
      categoria: 'dificultad'
    },
    {
      id: 'cinco_retos_dificiles',
      titulo: 'Conquistador',
      descripcion: 'Completa 5 retos difíciles',
      icono: '🏆',
      condicion: (retos) => retos.filter(reto => reto.dificultad === 'difícil').length >= 5,
      puntos: 100,
      categoria: 'dificultad'
    },

    // LOGROS DE VARIEDAD
    {
      id: 'versatil',
      titulo: 'Versátil',
      descripcion: 'Completa al menos 2 retos de cada dificultad',
      icono: '🎭',
      condicion: (retos) => {
        const faciles = retos.filter(r => r.dificultad === 'fácil').length;
        const medios = retos.filter(r => r.dificultad === 'medio').length;
        const dificiles = retos.filter(r => r.dificultad === 'difícil').length;
        return faciles >= 2 && medios >= 2 && dificiles >= 2;
      },
      puntos: 45,
      categoria: 'variedad'
    },

    // LOGROS DE VELOCIDAD (usando fechas reales)
    {
      id: 'velocista',
      titulo: 'Velocista',
      descripcion: 'Completa 3 retos en un día',
      icono: '⚡',
      condicion: (retos) => {
        // Verificar si algún día tuvo 3 o más retos
        const retosPorDia = new Map();
        retos.forEach(reto => {
          const fecha = new Date(reto.completedOn).toDateString();
          retosPorDia.set(fecha, (retosPorDia.get(fecha) || 0) + 1);
        });
        return Array.from(retosPorDia.values()).some(count => count >= 3);
      },
      puntos: 25,
      categoria: 'velocidad'
    },
    {
      id: 'maraton',
      titulo: 'Maratón Mental',
      descripcion: 'Completa 5 retos en un día',
      icono: '🏃‍♂️',
      condicion: (retos) => {
        // Verificar si algún día tuvo 5 o más retos
        const retosPorDia = new Map();
        retos.forEach(reto => {
          const fecha = new Date(reto.completedOn).toDateString();
          retosPorDia.set(fecha, (retosPorDia.get(fecha) || 0) + 1);
        });
        return Array.from(retosPorDia.values()).some(count => count >= 5);
      },
      puntos: 50,
      categoria: 'velocidad'
    },

    // LOGROS ESPECIALES (usando horarios reales)
    {
      id: 'noctambulo',
      titulo: 'Búho Nocturno',
      descripcion: 'Completa 5 retos después de medianoche',
      icono: '🦉',
      condicion: (retos) => {
        const retosNocturnos = retos.filter(reto => {
          const fecha = new Date(reto.completedOn);
          const hora = fecha.getHours();
          return hora >= 0 && hora < 6; // Entre medianoche y 6 AM
        });
        return retosNocturnos.length >= 5;
      },
      puntos: 30,
      categoria: 'especial'
    },
    {
      id: 'madrugador',
      titulo: 'Madrugador',
      descripcion: 'Completa 5 retos antes de las 7 AM',
      icono: '🌅',
      condicion: (retos) => {
        const retosMadrugada = retos.filter(reto => {
          const fecha = new Date(reto.completedOn);
          const hora = fecha.getHours();
          return hora >= 5 && hora < 7; // Entre 5 AM y 7 AM
        });
        return retosMadrugada.length >= 5;
      },
      puntos: 30,
      categoria: 'especial'
    },
    {
      id: 'fin_de_semana',
      titulo: 'Guerrero de Fin de Semana',
      descripcion: 'Completa 10 retos en fines de semana',
      icono: '🎉',
      condicion: (retos) => {
        const retosFinSemana = retos.filter(reto => {
          const fecha = new Date(reto.completedOn);
          const diaSemana = fecha.getDay();
          return diaSemana === 0 || diaSemana === 6; // Domingo o Sábado
        });
        return retosFinSemana.length >= 10;
      },
      puntos: 40,
      categoria: 'especial'
    },

    // LOGROS DE MAESTRÍA
    {
      id: 'experto',
      titulo: 'Experto',
      descripcion: 'Completa 30 retos',
      icono: '🎓',
      condicion: (retos) => retos.length >= 30,
      puntos: 150,
      categoria: 'maestria'
    },
    {
      id: 'maestro',
      titulo: 'Maestro de Retos',
      descripcion: 'Completa 50 retos',
      icono: '👑',
      condicion: (retos) => retos.length >= 50,
      puntos: 200,
      categoria: 'maestria'
    },
    {
      id: 'leyenda',
      titulo: 'Leyenda Viviente',
      descripcion: 'Completa 100 retos',
      icono: '🌟',
      condicion: (retos) => retos.length >= 100,
      puntos: 500,
      categoria: 'maestria'
    }
  ];

  // Función para registrar el notification manager
  const registerNotificationManager = useCallback((manager) => {
    setNotificationManager(manager);
  }, []);

  // Función helper para transformar logro secreto cuando se desbloquea
  const transformarLogroParaNotificacion = useCallback((logro) => {
    if (logro.secreto) {
      return {
        ...logro,
        titulo: logro.tituloDesbloqueado || logro.titulo,
        descripcion: logro.descripcionDesbloqueada || logro.descripcion,
        esLogroSecreto: true
      };
    }
    return logro;
  }, []);

  // Verificar nuevos logros desbloqueados y mostrarlos inmediatamente
  const verificarNuevosLogros = useCallback((retosCompletados, logrosAnteriores = new Set()) => {
    const nuevosLogros = [];
    
    logrosDisponibles.forEach(logro => {
      if (logro.condicion(retosCompletados) && !logrosAnteriores.has(logro.id)) {
        const logroParaNotificacion = transformarLogroParaNotificacion(logro);
        nuevosLogros.push(logroParaNotificacion);
      }
    });

    // Mostrar todas las notificaciones inmediatamente
    if (nuevosLogros.length > 0 && notificationManager) {
      nuevosLogros.forEach(logro => {
        notificationManager.addNotification(logro);
      });
    }

    return nuevosLogros;
  }, [logrosDisponibles, transformarLogroParaNotificacion, notificationManager]);

  // Función helper para obtener logros por categoría
  const getLogrosPorCategoria = useCallback((categoria) => {
    return logrosDisponibles.filter(logro => logro.categoria === categoria);
  }, []);

  // Función helper para obtener logros secretos
  const getLogrosSecretos = useCallback(() => {
    return logrosDisponibles.filter(logro => logro.secreto);
  }, []);

  const contextValue = {
    logrosDisponibles,
    verificarNuevosLogros,
    registerNotificationManager,
    getLogrosPorCategoria,
    getLogrosSecretos,
    // Función helper para calcular logros desbloqueados
    calcularLogrosDesbloqueados: (retosCompletados) => {
      const desbloqueados = new Set();
      logrosDisponibles.forEach(logro => {
        if (logro.condicion(retosCompletados)) {
          desbloqueados.add(logro.id);
        }
      });
      return desbloqueados;
    },
    // Función para obtener estadísticas de logros
    getEstadisticasLogros: (retosCompletados) => {
      const logrosDesbloqueados = contextValue.calcularLogrosDesbloqueados(retosCompletados);
      const totalPuntos = Array.from(logrosDesbloqueados)
        .map(id => logrosDisponibles.find(l => l.id === id)?.puntos || 0)
        .reduce((total, puntos) => total + puntos, 0);

      const logrosPorCategoria = {};
      ['iniciacion', 'consistencia', 'dificultad', 'variedad', 'velocidad', 'especial', 'maestria', 'secreto'].forEach(cat => {
        const totalCat = logrosDisponibles.filter(l => l.categoria === cat).length;
        const desbloqueadosCat = Array.from(logrosDesbloqueados)
          .filter(id => logrosDisponibles.find(l => l.id === id)?.categoria === cat).length;
        logrosPorCategoria[cat] = { total: totalCat, desbloqueados: desbloqueadosCat };
      });

      return {
        totalLogros: logrosDisponibles.length,
        logrosDesbloqueados: logrosDesbloqueados.size,
        totalPuntos,
        progreso: Math.round((logrosDesbloqueados.size / logrosDisponibles.length) * 100),
        logrosPorCategoria
      };
    },
    // Función helper para obtener el título y descripción correctos de un logro
    getLogroInfo: (logroId, estaDesbloqueado) => {
      const logro = logrosDisponibles.find(l => l.id === logroId);
      if (!logro) return null;
      
      // Si es un logro secreto y está desbloqueado, mostrar la info real
      if (logro.secreto && estaDesbloqueado) {
        return {
          ...logro,
          titulo: logro.tituloDesbloqueado || logro.titulo,
          descripcion: logro.descripcionDesbloqueada || logro.descripcion
        };
      }
      
      return logro;
    },
    getRetosHoy: (retosCompletados) => {
      return contarRetosEnDia(retosCompletados, new Date());
    },
    getRachaDias: (retosCompletados) => {
      // Calcular racha actual de días consecutivos
      const fechasUnicas = [...new Set(retosCompletados.map(reto => 
        new Date(reto.completedOn).toDateString()
      ))].sort();
      
      let rachaActual = 0;
      const hoy = new Date().toDateString();
      
      for (let i = fechasUnicas.length - 1; i >= 0; i--) {
        const fecha = new Date(fechasUnicas[i]);
        const fechaEsperada = new Date();
        fechaEsperada.setDate(fechaEsperada.getDate() - rachaActual);
        
        if (fecha.toDateString() === fechaEsperada.toDateString()) {
          rachaActual++;
        } else {
          break;
        }
      }
      
      return rachaActual;
    }
  };

  return (
    <LogrosContext.Provider value={contextValue}>
      {children}
    </LogrosContext.Provider>
  );
};

export default LogrosContext;