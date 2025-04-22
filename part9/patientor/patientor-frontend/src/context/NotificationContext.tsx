import { createContext, useState } from 'react';
import { Notification } from '../types';

interface ContextType {
  notification: Notification;
  setNotification: React.Dispatch<React.SetStateAction<Notification>>;
  currentTimeout: number;
  setCurrentTimeout: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationContext = createContext<ContextType>({
  notification: { message: '', isError: false },
  setNotification: () => {},
  currentTimeout: NaN,
  setCurrentTimeout: () => {},
});

export const NotificationContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notification, setNotification] = useState<Notification>({
    message: '',
    isError: false,
  });
  const [currentTimeout, setCurrentTimeout] = useState<number>(NaN);
  const value = {
    notification,
    setNotification,
    currentTimeout,
    setCurrentTimeout,
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
export default NotificationContext;
