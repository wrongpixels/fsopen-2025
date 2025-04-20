import { createContext, useContext, useState } from 'react';

interface Notification {
  message: string;
  isError: boolean;
}

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

export const useNotification = () => {
  const { notification, setNotification, currentTimeout, setCurrentTimeout } =
    useContext(NotificationContext);
  const clearNotification = () =>
    newNotification({ message: '', isError: false });
  const newNotification = (not: Notification) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    setNotification(not);
    if (not.message) {
      setCurrentTimeout(setTimeout(() => clearNotification(), 5000));
    }
  };
  const showError = (message: string) =>
    newNotification({ message, isError: true });
  const showNotification = (message: string) =>
    newNotification({ message, isError: false });
  return { notification, showError, showNotification };
};

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
