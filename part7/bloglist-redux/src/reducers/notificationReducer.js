const defaultNotification = { message: "", error: true };

const notificationReducer = (
  state = defaultNotification,
  { type, payload },
) => {
  switch (type) {
    case "SET_NOTIFICATION":
      return payload;
    case "RESET_NOTIFICATION":
      return defaultNotification;
    default:
      return state;
  }
};

export default notificationReducer;
