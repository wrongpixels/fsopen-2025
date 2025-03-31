import { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext();

const notificationReducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_NOTIFICATION":
      return payload;
    case "RESET_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

export const useValue = () => useContext(NotificationContext)[0];
export const useDispatch = () => useContext(NotificationContext)[1];

export const NotificationContextProvider = (props) => {
  const providerValues = useReducer(notificationReducer, "");
  return (
    <NotificationContext.Provider value={providerValues}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
