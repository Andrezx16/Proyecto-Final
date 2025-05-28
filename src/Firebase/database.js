import { initializeApp } from "firebase/app"
import { getFirestore,collection, setDoc, doc,getDoc,deleteDoc } from "firebase/firestore" // <-- ¡Importante!
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