import { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext();
const initialState = { message: "", error: false };

const notificationReducer = (state, { type, payload }) => {
  switch (type) {
    case "NOTIFICATION_SET":
      return payload;
    case "NOTIFICATION_RESET":
      return initialState;
    default:
      return state;
  }
};

export const useValue = () => useContext(NotificationContext)[0];
export const useDispatch = () => useContext(NotificationContext)[1];

export const NotificationContextProvider = (props) => {
  const providerValues = useReducer(notificationReducer, initialState);
  return (
    <NotificationContext.Provider value={providerValues}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
