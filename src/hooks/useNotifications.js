import { useRef } from 'react';

const useNotifications = () => {
  const notificationManagerRef = useRef();

  const showNotification = (logro) => {
    if (notificationManagerRef.current) {
      notificationManagerRef.current.addNotification(logro);
    }
  };

  return {
    notificationManagerRef,
    showNotification
  };
};

export default useNotifications;