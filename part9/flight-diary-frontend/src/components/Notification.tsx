interface NotificationProps {
  message: string;
}

const Notification = (props: NotificationProps) => {
  const notificationStyle = {
    color: 'red',
    fontSize: '20px',
  };

  if (!props.message) {
    return null;
  }

  return (
    <p style={notificationStyle}>
      <b>[{props.message}]</b>
    </p>
  );
};

export default Notification;
