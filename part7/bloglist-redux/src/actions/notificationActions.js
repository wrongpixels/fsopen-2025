const createNotification = (_message) => ({
  type: "SET_NOTIFICATION",
  payload: {
    message: _message,
    error: false,
  },
});

const createError = (_message) => ({
  type: "SET_NOTIFICATION",
  payload: {
    message: _message,
    error: true,
  },
});

export const createAlert = (message, error) =>
  error ? createError(message) : createNotification(message);

export const resetAlert = { type: "RESET_NOTIFICATION" };
