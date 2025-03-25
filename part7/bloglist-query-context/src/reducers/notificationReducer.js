import { createSlice } from "@reduxjs/toolkit";

const initialState = { message: "", error: true };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, { payload }) => payload,
    resetNotification: () => initialState,
  },
});

export const { setNotification, resetNotification } = notificationSlice.actions;

let currentTimeOut = null;

export const createAlert = (message, error = true, time = 5) => {
  return async (dispatch) => {
    if (currentTimeOut) {
      clearTimeout(currentTimeOut);
    }
    dispatch(setNotification({ message, error }));
    currentTimeOut = setTimeout(
      () => dispatch(resetNotification()),
      time * 1000,
    );
  };
};

export default notificationSlice.reducer;
