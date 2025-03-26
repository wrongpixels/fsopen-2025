export const login = (userData) => ({
  type: "LOGIN",
  payload: userData,
});

export const logout = {
  type: "LOGOUT",
};

export const restore = {
  type: "RESTORE_SESSION",
};
