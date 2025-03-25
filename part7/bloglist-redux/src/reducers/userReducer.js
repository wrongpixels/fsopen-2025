import loginService from "../services/login.js";
import blogService from "../services/blogs.js";
import { createSlice, current } from "@reduxjs/toolkit";
import { createAlert } from "./notificationReducer.js";
const USER_KEY = "activeUser";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    login: (state, { payload }) => {
      if (!payload?.token) {
        window.localStorage.removeItem(USER_KEY);
        return null;
      }
      window.localStorage.setItem(USER_KEY, JSON.stringify(payload));
      blogService.buildToken(payload.token);
      return payload;
    },
    logout: () => {
      window.localStorage.removeItem(USER_KEY);
      blogService.buildToken("");
      return null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const userLogin = (username, password) => {
  return async (dispatch) => {
    const userData = await loginService.tryLogin(username, password);
    if (!userData) {
      dispatch(createAlert(`Login failed: Server error`));
      return;
    }
    if (userData.error) {
      dispatch(createAlert(userData.error));
      return;
    }
    if (!userData.token) {
      dispatch(createAlert("Token is not valid."));
      return;
    }
    dispatch(createAlert(`Welcome back, ${userData.name}!`, false));
    dispatch(login(userData));
  };
};

export const userLogout = (user) => {
  return (dispatch) => {
    dispatch(createAlert(`See you soon, ${user.name}!`, false));
    dispatch(logout());
  };
};

export default userSlice.reducer;
