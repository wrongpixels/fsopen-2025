import {
  setNotification,
  resetNotification,
} from "../actions/notificationActions";
import { useNotificationDispatch } from "../context/NotificationContext";

const useNotification = () => {
  const dispatch = useNotificationDispatch();

  let currentTimeOut = null;

  const showError = (message, time = 5) => {
    showAlert(message, true, time);
  };
  const showNotification = (message, time = 5) => {
    showAlert(message, false, time);
  };
  const showAlert = (message, error = true, time = 5) => {
    if (currentTimeOut) {
      clearTimeout(currentTimeOut);
    }
    dispatch(setNotification(message, error));
    currentTimeOut = setTimeout(() => dispatch(resetNotification), time * 1000);
  };
  return { showAlert, showNotification, showError };
};

export default useNotification;
