// utils/achievementsConfig.js
export const ACHIEVEMENTS = {
  // Logros por cantidad de retos completados
  FIRST_CHALLENGE: {
    id: 'first_challenge',
    name: '¡Primer Paso!',
    description: 'Completa tu primer reto',
    icon: '🎯',
    requirement: { type: 'challenges_completed', count: 1 },
    points: 10,
    rarity: 'common'
  },
  FIVE_CHALLENGES: {
    id: 'five_challenges',
    name: 'En Racha',
    description: 'Completa 5 retos',
    icon: '🔥',
    requirement: { type: 'challenges_completed', count: 5 },
    points: 25,
    rarity: 'uncommon'
  },
  TEN_CHALLENGES: {
    id: 'ten_challenges',
    name: 'Imparable',
    description: 'Completa 10 retos',
    icon: '⚡',
    requirement: { type: 'challenges_completed', count: 10 },
    points: 50,
    rarity: 'rare'
  },
  
  // Logros por categorías específicas
  CREATIVITY_MASTER: {
    id: 'creativity_master',
    name: 'Maestro Creativo',
    description: 'Completa 5 retos de creatividad',
    icon: '🎨',
    requirement: { type: 'category_challenges', category: 'creatividad', count: 5 },
    points: 40,
    rarity: 'rare'
  },
  DISCIPLINE_WARRIOR: {
    id: 'discipline_warrior',
    name: 'Guerrero Disciplinado',
    description: 'Completa 5 retos de disciplina',
    icon: '🛡️',
    requirement: { type: 'category_challenges', category: 'disciplina', count: 5 },
    points: 40,
    rarity: 'rare'
  },
  
  // Logros por dificultad
  EASY_STARTER: {
    id: 'easy_starter',
    name: 'Comienzo Suave',
    description: 'Completa 3 retos fáciles',
    icon: '🌱',
    requirement: { type: 'difficulty_challenges', difficulty: 'fácil', count: 3 },
    points: 15,
    rarity: 'common'
  },
  HARD_CHALLENGER: {
    id: 'hard_challenger',
    name: 'Desafiante',
    description: 'Completa 3 retos difíciles',
    icon: '💪',
    requirement: { type: 'difficulty_challenges', difficulty: 'difícil', count: 3 },
    points: 60,
    rarity: 'epic'
  },
  
  // Logros por racha
  THREE_DAY_STREAK: {
    id: 'three_day_streak',
    name: 'Constancia',
    description: 'Completa retos 3 días seguidos',
    icon: '📅',
    requirement: { type: 'daily_streak', days: 3 },
    points: 30,
    rarity: 'uncommon'
  },
  WEEK_STREAK: {
    id: 'week_streak',
    name: 'Semana Perfecta',
    description: 'Completa retos 7 días seguidos',
    icon: '👑',
    requirement: { type: 'daily_streak', days: 7 },
    points: 100,
    rarity: 'legendary'
  },
  
  // Logros especiales
  QUIZ_MASTER: {
    id: 'quiz_master',
    name: 'Maestro del Quiz',
    description: 'Completa el quiz inicial',
    icon: '🧠',
    requirement: { type: 'quiz_completed' },
    points: 5,
    rarity: 'common'
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Demonio de la Velocidad',
    description: 'Completa 5 retos en menos de 24 horas',
    icon: '💨',
    requirement: { type: 'challenges_in_timeframe', count: 5, hours: 24 },
    points: 75,
    rarity: 'epic'
  }
};

// Función para verificar logros
export const checkAchievements = (userStats, completedAchievements = []) => {
  const newAchievements = [];
  
  Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
    // Si ya tiene el logro, skip
    if (completedAchievements.includes(achievement.id)) return;
    
    let isUnlocked = false;
    
    switch (achievement.requirement.type) {
      case 'challenges_completed':
        isUnlocked = userStats.totalChallenges >= achievement.requirement.count;
        break;
        
      case 'category_challenges':
        const categoryCount = userStats.categoryChallenges?.[achievement.requirement.category] || 0;
        isUnlocked = categoryCount >= achievement.requirement.count;
        break;
        
      case 'difficulty_challenges':
        const difficultyCount = userStats.difficultyChallenges?.[achievement.requirement.difficulty] || 0;
        isUnlocked = difficultyCount >= achievement.requirement.count;
        break;
        
      case 'daily_streak':
        isUnlocked = userStats.currentStreak >= achievement.requirement.days;
        break;
        
      case 'quiz_completed':
        isUnlocked = userStats.quizCompleted === true;
        break;
        
      case 'challenges_in_timeframe':
        // Verificar retos completados en las últimas X horas
        const now = new Date();
        const timeLimit = new Date(now.getTime() - (achievement.requirement.hours * 60 * 60 * 1000));
        const recentChallenges = userStats.recentCompletions?.filter(
          completion => new Date(completion) > timeLimit
        ).length || 0;
        isUnlocked = recentChallenges >= achievement.requirement.count;
        break;
    }
    
    if (isUnlocked) {
      newAchievements.push(achievement);
    }
  });
  
  return newAchievements;
};

// Función para calcular estadísticas del usuario
export const calculateUserStats = (completedChallenges = [], quizCompleted = false) => {
  const now = new Date();
  const stats = {
    totalChallenges: completedChallenges.length,
    categoryChallenges: {},
    difficultyChallenges: {},
    currentStreak: 0,
    longestStreak: 0,
    totalPoints: 0,
    quizCompleted,
    recentCompletions: []
  };
  
  // Agrupar por categorías y dificultades
  completedChallenges.forEach(challenge => {
    // Categorías
    const category = challenge.categoria?.toLowerCase() || 'general';
    stats.categoryChallenges[category] = (stats.categoryChallenges[category] || 0) + 1;
    
    // Dificultades
    const difficulty = challenge.dificultad?.toLowerCase() || 'medio';
    stats.difficultyChallenges[difficulty] = (stats.difficultyChallenges[difficulty] || 0) + 1;
    
    // Fechas recientes para logros de velocidad
    if (challenge.completadoEn) {
      stats.recentCompletions.push(challenge.completadoEn);
    }
  });
  
  // Calcular racha actual
  const sortedChallenges = completedChallenges
    .filter(c => c.completadoEn)
    .sort((a, b) => new Date(b.completadoEn) - new Date(a.completadoEn));
  
  if (sortedChallenges.length > 0) {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Crear array de fechas únicas
    const uniqueDates = [...new Set(
      sortedChallenges.map(c => new Date(c.completadoEn).toDateString())
    )].sort((a, b) => new Date(b) - new Date(a));
    
    // Calcular racha actual
    let currentDate = new Date();
    for (let i = 0; i < uniqueDates.length; i++) {
      const challengeDate = new Date(uniqueDates[i]);
      const daysDiff = Math.floor((currentDate - challengeDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= i + (i === 0 ? 1 : 0)) { // Permite el día actual o días consecutivos
        currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === 0) tempStreak = 0; // Reset si no hay actividad reciente
        break;
      }
    }
    
    stats.currentStreak = currentStreak;
    stats.longestStreak = Math.max(longestStreak, currentStreak);
  }
  
  return stats;
};

// Función para obtener el color según la rareza
export const getRarityColor = (rarity) => {
  const colors = {
    common: '#9E9E9E',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FF9800'
  };
  return colors[rarity] || colors.common;
};