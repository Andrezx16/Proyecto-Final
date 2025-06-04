import { initializeApp } from "firebase/app"
import { getFirestore, collection, setDoc, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore" // <-- Agregué updateDoc
import useUsuario from "../hooks/useUsuario"
const { VITE_FIREBASE_CONFIG } = import.meta.env


const firebaseConfig = JSON.parse(VITE_FIREBASE_CONFIG)

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)


export const saveQuizAnswers = async (email, answers, userName) => {
  if (!email) throw new Error('El email es requerido')

  const ref = doc(collection(db, 'quizAnswers'), email)
  await setDoc(ref, {
    email,
    answers,
    userName,
    timestamp: new Date()
  })
}



export const hasCompletedQuiz = async (email) => {
  const ref = doc(collection(db, 'quizAnswers'), email)
  const snapshot = await getDoc(ref)
  return snapshot.exists()
}

export const deleteQuizAnswers = async (email) => {
  const ref = doc(collection(db, 'quizAnswers'), email)
  await deleteDoc(ref)
}
// Agrega estas funciones a tu archivo Firebase/database.js existente

// Función para obtener las respuestas del quiz de un usuario

// Función corregida para obtener las respuestas del quiz de un usuario
export const getQuizAnswers = async (email) => {
  try {
    // Cambiar de "usuarios" a "quizAnswers" para coincidir con donde se guardan
    const userDoc = await getDoc(doc(db, "quizAnswers", email));
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("Respuestas obtenidas:", data.answers); // Debug
      return data.answers || null; // Cambiar de 'quizAnswers' a 'answers'
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo respuestas del quiz:", error);
    return null;
  }
};

// Función para guardar un reto completado
export const saveCompletedChallenge = async (email, challengeData) => {
  try {
    const userRef = doc(db, "usuarios", email);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const completedChallenges = userData.completedChallenges || [];
      
      // Agregar el nuevo reto completado
      completedChallenges.push(challengeData);
      
      await updateDoc(userRef, {
        completedChallenges: completedChallenges,
        lastChallengeCompleted: new Date().toISOString()
      });
      
      console.log("Reto completado guardado exitosamente");
    } else {
      // Si el documento del usuario no existe, créalo
      await setDoc(userRef, {
        email: email,
        completedChallenges: [challengeData],
        lastChallengeCompleted: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
      
      console.log("Usuario creado y reto completado guardado");
    }
  } catch (error) {
    console.error("Error guardando reto completado:", error);
    throw error;
  }
};

// Función para obtener retos completados de un usuario
export const getCompletedChallenges = async (email) => {
  try {
    const userDoc = await getDoc(doc(db, "usuarios", email));
    if (userDoc.exists()) {
      return userDoc.data().completedChallenges || [];
    }
    return [];
  } catch (error) {
    console.error("Error obteniendo retos completados:", error);
    return [];
  }
};
