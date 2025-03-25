export const setNotification = (message, error = true) => ({
  type: "NOTIFICATION_SET",
  payload: { message, error },
});

export const resetNotification = {
  type: "NOTIFICATION_RESET",
  payload: null,
};

let currentTimeOut = null;

export const showAlert = (dispatch, message, error = true, time = 5) => {
  if (!dispatch) {
    return;
  }
  if (currentTimeOut) {
    clearTimeout(currentTimeOut);
  }
  dispatch(setNotification(message, error));
  currentTimeOut = setTimeout(() => dispatch(resetNotification), time * 1000);
};
