import React, { useState } from "react";
import "../css/quiz.css";
import useUsuario from "../hooks/useUsuario";
import { saveQuizAnswers } from "../Firebase/database";

const Quiz = ({ onFinish }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const usuario = useUsuario();

  const questions = [
    {
      id: 1,
      question: "¿Qué habilidad te gustaría mejorar?",
      options: [
        { label: "Creatividad", img: "/img/creatividad.png" },
        { label: "Disciplina", img: "/img/disciplina.png" },
        { label: "Comunicación", img: "/img/comunicacion.png" },
        { label: "Organización", img: "/img/organizacion.png" },
      ],
    },
    {
      id: 2,
      question: "¿En qué estado de ánimo estás actualmente?",
      options: [
        { label: "Triste", img: "/img/triste.png" },
        { label: "Feliz", img: "/img/feliz.png" },
        { label: "Enojado", img: "/img/enojado.png" },
      ],
    },
    {
      id: 3,
      question: "¿Cuánto tiempo puedes dedicar a un mini-reto?",
      options: [
        { label: "5 minutos", img: "/img/5min.png" },
        { label: "15 minutos", img: "/img/15min.png" },
        { label: "30 minutos", img: "/img/30min.png" },,
      ],
    },
  ];

  const handleAnswer = (id, optLabel) => {
    const updated = { ...answers, [id]: optLabel };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      if (!usuario?.email) {
        console.error("El email es requerido");
        return;
      }

      saveQuizAnswers(usuario.email, updated, usuario.username || "Anónimo")
        .then(() => {
          console.log("Respuestas guardadas");
          onFinish();
        })
        .catch((error) => {
          console.error("Error guardando respuestas:", error);
        });
    }
  };

  if (!usuario) return null;

  const q = questions[step];

  return (
    <div className="Quiz-menu">
      <h1 className="">Quiz Inicial</h1>
      <h2 >{q.question}</h2>
      <div className="btn-group">
        {q.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleAnswer(q.id, opt.label)}
            className="btn"
          >
            <img src={opt.img} alt={opt.label} className="btn-img" />
            {q.id !== 3 && <span>{opt.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
