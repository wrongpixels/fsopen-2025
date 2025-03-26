import { useReducer, useContext, createContext } from "react";

const USER_KEY = "activeUser";

const UserLoginContext = createContext();

const userLoginReducer = (state, { type, payload }) => {
  switch (type) {
    case "LOGIN": {
      window.localStorage.setItem(USER_KEY, JSON.stringify(payload || null));
      return payload;
    }
    case "LOGOUT": {
      window.localStorage.removeItem(USER_KEY);
      return null;
    }
    case "RESTORE_SESSION": {
      const existing = window.localStorage.getItem(USER_KEY);
      if (!existing) {
        return null;
      }
      const validUser = JSON.parse(existing);
      if (validUser?.token) {
        return validUser;
      }
      window.localStorage.removeItem(USER_KEY);
      return null;
    }
    default:
      return state;
  }
};
export const useLoginValue = () => useContext(UserLoginContext)[0];
export const useLoginDispatch = () => useContext(UserLoginContext)[1];

export const UserLoginContextProvider = ({ children }) => {
  const propValues = useReducer(userLoginReducer, null);

  return (
    <UserLoginContext.Provider value={propValues}>
      {children}
    </UserLoginContext.Provider>
  );
};

export default UserLoginContext;
