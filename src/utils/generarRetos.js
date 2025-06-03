export const generarReto = (answers) => {
  const habilidad = answers[1]; // Creatividad, Disciplina, Comunicación, Organización
  const animo = answers[2]; // Triste, Feliz, Enojado
  const tiempo = answers[3]; // 5 minutos, 15 minutos, 30 minutos

  // Base de datos de retos predefinidos
  const retosBase = {
    // CREATIVIDAD
    Creatividad: {
      Triste: {
        "5 minutos": {
          titulo: "Dibuja tu estado de ánimo",
          descripcion: "Toma papel y lápiz, dibuja cómo te sientes ahora mismo. No importa si no sabes dibujar.",
          categoria: "Arte Terapia",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Escribe 3 cosas buenas",
          descripcion: "Escribe una historia corta sobre 3 cosas buenas que te han pasado esta semana.",
          categoria: "Escritura Creativa",
          dificultad: "fácil"
        },
        "30 minutos": {
          titulo: "Crea tu playlist de ánimo",
          descripcion: "Crea una playlist con canciones que te hagan sentir mejor y diseña su portada.",
          categoria: "Música y Arte",
          dificultad: "medio"
        }
      },
      Feliz: {
        "5 minutos": {
          titulo: "Foto creativa del día",
          descripcion: "Toma una foto creativa de algo ordinario desde un ángulo inusual.",
          categoria: "Fotografía",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Inventa una receta loca",
          descripcion: "Combina 3 ingredientes que nunca has mezclado y crea algo nuevo.",
          categoria: "Cocina Creativa",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Redecora un espacio",
          descripcion: "Reorganiza creativamente un rincón de tu casa solo con lo que ya tienes.",
          categoria: "Decoración",
          dificultad: "medio"
        }
      },
      Enojado: {
        "5 minutos": {
          titulo: "Garabato de furia",
          descripcion: "Dibuja líneas y formas expresando tu enojo en papel. Después rómpelo.",
          categoria: "Arte Terapia",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Carta al enojo",
          descripcion: "Escribe una carta dirigida a tu enojo explicándole por qué está ahí.",
          categoria: "Escritura Terapéutica",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Escultura de emociones",
          descripcion: "Usa plastilina, masa o papel para crear una escultura que represente tu enojo.",
          categoria: "Escultura",
          dificultad: "medio"
        }
      }
    },

    // DISCIPLINA
    Disciplina: {
      Triste: {
        "5 minutos": {
          titulo: "Respira y cuenta",
          descripcion: "Haz 10 respiraciones profundas contando hasta 4 al inhalar y 6 al exhalar.",
          categoria: "Consciencia",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Organiza 1 cajón",
          descripcion: "Elige un cajón desordenado y organízalo completamente. Siente el logro.",
          categoria: "Organización",
          dificultad: "fácil"
        },
        "30 minutos": {
          titulo: "Rutina de autocuidado",
          descripcion: "Crea y ejecuta una rutina de 30 min: ducha, estiramientos y té.",
          categoria: "Bienestar",
          dificultad: "medio"
        }
      },
      Feliz: {
        "5 minutos": {
          titulo: "Lista de metas mini",
          descripcion: "Escribe 3 metas pequeñas que puedes lograr hoy mismo.",
          categoria: "Productividad",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Ejercicio de enfoque",
          descripcion: "Haz una tarea pendiente por 15 min sin distracciones. Solo eso.",
          categoria: "Concentración",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Planifica tu semana",
          descripcion: "Crea un plan semanal con horarios específicos para tus prioridades.",
          categoria: "Planificación",
          dificultad: "medio"
        }
      },
      Enojado: {
        "5 minutos": {
          titulo: "Flexiones de liberación",
          descripcion: "Haz flexiones, sentadillas o burpees hasta cansarte y liberar tensión.",
          categoria: "Ejercicio",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Limpieza de furia",
          descripcion: "Limpia agresivamente un área de tu casa. Canaliza la energía.",
          categoria: "Limpieza Activa",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Rutina de descarga",
          descripcion: "Ejercicio físico intenso + ducha fría + 5 min de meditación.",
          categoria: "Manejo de Ira",
          dificultad: "difícil"
        }
      }
    },

    // COMUNICACIÓN
    Comunicación: {
      Triste: {
        "5 minutos": {
          titulo: "Mensaje de ánimo",
          descripcion: "Envía un mensaje de ánimo a alguien que también pueda estar triste.",
          categoria: "Conexión Social",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Llama a alguien querido",
          descripcion: "Llama a un familiar o amigo y cuéntale cómo te sientes honestly.",
          categoria: "Comunicación Emocional",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Carta de agradecimiento",
          descripcion: "Escribe una carta física de agradecimiento a alguien importante para ti.",
          categoria: "Gratitud",
          dificultad: "medio"
        }
      },
      Feliz: {
        "5 minutos": {
          titulo: "Piropo genuino",
          descripcion: "Dale un cumplido genuino y específico a alguien cercano.",
          categoria: "Positividad",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Comparte tu alegría",
          descripcion: "Cuenta a 3 personas diferentes por qué estás feliz hoy.",
          categoria: "Comunicación Positiva",
          dificultad: "fácil"
        },
        "30 minutos": {
          titulo: "Planea una sorpresa",
          descripcion: "Planifica una pequeña sorpresa para alguien especial y comunícasela.",
          categoria: "Gestos de Amor",
          dificultad: "medio"
        }
      },
      Enojado: {
        "5 minutos": {
          titulo: "Pausa antes de hablar",
          descripcion: "Si tienes que hablar con alguien, cuenta hasta 10 antes de cada respuesta.",
          categoria: "Autocontrol",
          dificultad: "medio"
        },
        "15 minutos": {
          titulo: "Expresa asertivamente",
          descripcion: "Escribe qué te molesta usando 'Yo siento... cuando... porque...'",
          categoria: "Comunicación Asertiva",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Conversación sanadora",
          descripcion: "Busca a la persona que te molesta y habla calmadamente sobre el problema.",
          categoria: "Resolución de Conflictos",
          dificultad: "difícil"
        }
      }
    },

    // ORGANIZACIÓN
    Organización: {
      Triste: {
        "5 minutos": {
          titulo: "Ordena tu espacio personal",
          descripcion: "Organiza tu escritorio o mesita de noche. Pequeños cambios, gran impacto.",
          categoria: "Organización Personal",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Lista de pendientes simple",
          descripcion: "Haz una lista de 5 cosas que te haría sentir mejor si las terminaras.",
          categoria: "Productividad",
          dificultad: "fácil"
        },
        "30 minutos": {
          titulo: "Organiza tu día ideal",
          descripcion: "Planifica cómo sería tu día perfecto y toma 1 acción hacia eso.",
          categoria: "Planificación de Vida",
          dificultad: "medio"
        }
      },
      Feliz: {
        "5 minutos": {
          titulo: "Archivo digital rápido",
          descripcion: "Organiza 20 fotos de tu teléfono en carpetas por fecha o tema.",
          categoria: "Organización Digital",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Sistema de recordatorios",
          descripcion: "Configura 3 recordatorios en tu teléfono para cosas que siempre olvidas.",
          categoria: "Sistemas",
          dificultad: "fácil"
        },
        "30 minutos": {
          titulo: "Optimiza tu rutina",
          descripcion: "Analiza tu rutina matutina y encuentra 3 formas de hacerla más eficiente.",
          categoria: "Optimización",
          dificultad: "medio"
        }
      },
      Enojado: {
        "5 minutos": {
          titulo: "Deshazte de 5 cosas",
          descripcion: "Encuentra 5 objetos que no uses y ponlos en una bolsa para donar.",
          categoria: "Minimalismo",
          dificultad: "fácil"
        },
        "15 minutos": {
          titulo: "Reorganiza con fuerza",
          descripcion: "Elige un área desordenada y reorganízala completamente con energía.",
          categoria: "Reorganización",
          dificultad: "medio"
        },
        "30 minutos": {
          titulo: "Sistema anti-caos",
          descripcion: "Crea un sistema para evitar que se desordene tu espacio más problemático.",
          categoria: "Sistemas de Orden",
          dificultad: "medio"
        }
      }
    }
  };

  // Buscar el reto específico
  try {
    const reto = retosBase[habilidad]?.[animo]?.[tiempo];
    
    if (reto) {
      return {
        ...reto,
        id: Date.now(), // ID único
        fecha: new Date().toLocaleDateString(),
        respuestas: answers // Guardar las respuestas originales
      };
    } else {
      // Reto por defecto si no encuentra coincidencia
      return {
        titulo: "Reto personalizado",
        descripcion: `Tómate ${tiempo.toLowerCase()} para trabajar en tu ${habilidad.toLowerCase()} según cómo te sientes hoy.`,
        categoria: "General",
        dificultad: "medio",
        id: Date.now(),
        fecha: new Date().toLocaleDateString(),
        respuestas: answers
      };
    }
  } catch (error) {
    console.error('Error generando reto:', error);
    return {
      titulo: "Reto del día",
      descripcion: "Tómate unos minutos para reflexionar sobre tus respuestas y hacer algo positivo por ti.",
      categoria: "Bienestar",
      dificultad: "fácil",
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      respuestas: answers
    };
  }
};

// Función adicional para obtener retos aleatorios de la misma categoría
export const obtenerRetosRelacionados = (retoActual) => {
  const { respuestas } = retoActual;
  const habilidad = respuestas[1];
  
  // Obtener otros retos de la misma habilidad con diferentes estados de ánimo
  const retosRelacionados = [];
  const estados = ['Triste', 'Feliz', 'Enojado'];
  const tiempos = ['5 minutos', '15 minutos', '30 minutos'];
  
  estados.forEach(estado => {
    tiempos.forEach(tiempo => {
      if (estado !== respuestas[2] || tiempo !== respuestas[3]) {
        const reto = generarReto({
          ...respuestas,
          2: estado,
          3: tiempo
        });
        retosRelacionados.push(reto);
      }
    });
  });
  
  return retosRelacionados; // Devolver todos los retos
};