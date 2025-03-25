import { useNotificationValue } from "../context/NotificationContext.jsx";

const Notification = ({ notification }) => {
  const { message, error } = useNotificationValue();
  console.log(message);

  if (!message) {
    return null;
  }

  const notificationStyle = {
    color: error ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 6,
    padding: 10,
    margin: 10,
  };

  return (
    <div style={notificationStyle} className="notification">
      {message}
    </div>
  );
};

export default Notification;
