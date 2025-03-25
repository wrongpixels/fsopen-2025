import { useSelector } from "react-redux";

const Notification = () => {
  const { notification } = useSelector((s) => s);
  const { message, error } = notification;

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
