import React, { useEffect } from 'react';

function crearEstrella(x, y) {
  const estrella = document.createElement('div');
  const size = Math.random() * 8 + 4;
  const color = 'rgba(139, 216, 235, 0.34)'; 
  estrella.style.position = 'fixed';
  estrella.style.left = `${x}px`;
  estrella.style.top = `${y}px`;
  estrella.style.width = `${size}px`;
  estrella.style.height = `${size}px`;
  estrella.style.borderRadius = '50%';
  estrella.style.background = color;
  estrella.style.boxShadow = `0 0 12px rgba(149, 226, 250, 0.52), 0 0 24px rgba(122, 171, 204, 0.5)`;
  estrella.style.pointerEvents = 'none';
  estrella.style.zIndex = '9999';
  estrella.style.opacity = '1';
  estrella.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';

  document.body.appendChild(estrella);

  // Dispersión aleatoria
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * 80;
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  setTimeout(() => {
    estrella.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
    estrella.style.opacity = '0';
  }, 10);

  setTimeout(() => {
    estrella.remove();
  }, 500);
}

function SeguimientoEstrellas() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      for (let i = 0; i < 3; i++) {
        const offsetX = Math.random() * 20 - 10;
        const offsetY = Math.random() * 20 - 10;
        crearEstrella(e.clientX + offsetX, e.clientY + offsetY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return null;
}

export default SeguimientoEstrellas;
