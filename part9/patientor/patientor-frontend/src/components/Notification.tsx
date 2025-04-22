import { useNotification } from '../hooks';
import { Alert } from '@mui/material';

const Notification = () => {
  const { notification } = useNotification();

  if (!notification.message) {
    return null;
  }

  return (
    <>
      <Alert
        color={notification.isError ? 'error' : 'success'}
        severity={notification.isError ? 'error' : 'success'}
      >
        {notification.message}
      </Alert>
    </>
  );
};

export default Notification;
