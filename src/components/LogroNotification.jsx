import React, { useEffect, useState } from 'react';
import '../css/logro-notification.css';

const LogroNotification = ({ logro, onClose, isVisible }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className={`logro-notification ${isVisible ? 'show' : 'hide'}`}>
      <div className="notification-content">
        <div className="notification-header">
          <span className="trophy-icon">🏆</span>
          <h3>¡Logro Desbloqueado!</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="notification-body">
          <div className="logro-icon-large">{logro.icono}</div>
          <div className="logro-details">
            <h4>{logro.titulo}</h4>
            <p>{logro.descripcion}</p>
            <div className="puntos-ganados">
              <span>+{logro.puntos} puntos</span>
            </div>
          </div>
        </div>
        
        <div className="notification-footer">
          <div className="celebration">✨ ¡Felicitaciones! ✨</div>
        </div>
      </div>
    </div>
  );
};

export default LogroNotification;