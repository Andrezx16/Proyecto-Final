import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import LogroNotification from './LogroNotification';

const NotificationManager = forwardRef((props, ref) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((logro) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      logro,
      isVisible: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isVisible: false }
          : notification
      )
    );

    setTimeout(() => {
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      );
    }, 300);
  }, []);

  useImperativeHandle(ref, () => ({
    addNotification
  }));

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <LogroNotification
          key={notification.id}
          logro={notification.logro}
          isVisible={notification.isVisible}
          onClose={() => closeNotification(notification.id)}
        />
      ))}
    </div>
  );
});

NotificationManager.displayName = 'NotificationManager';

export default NotificationManager;