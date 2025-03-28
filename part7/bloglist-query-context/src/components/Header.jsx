import { useRef } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm.jsx";
import Notification from "./Notification.jsx";
import useNotification from "../hooks/useNotification.js";
import useActiveUser from "../hooks/useActiveUser.js";

const barStyle = {
  padding: "8px",
  display: "flex",
  gap: "0.75rem",
  background: "#D4DCE5",
};

const Header = ({ user }) => {
  const { showNotification } = useNotification();
  const { resetUserData, setUserData } = useActiveUser();

  const loginFormRef = useRef();

  const resetSession = () => {
    showNotification(`See you soon, ${user.name}!`);
    loginFormRef.current?.cleanForm();
    resetUserData();
  };

  const setSession = (userData) => {
    setUserData(userData);
    showNotification(`Welcome back, ${userData.name}!`);
  };

  return (
    <div>
      <p style={barStyle}>
        <Link to="/">
          <b>Blogs</b>
        </Link>
        <Link to="/users">
          <b>Users</b>
        </Link>
        {user && (
          <>
            <span>
              Logged in as <b> {user.username} </b>
            </span>{" "}
            <button onClick={resetSession}>Log out</button>
          </>
        )}
      </p>
      <Notification />
      {!user && <LoginForm setSession={setSession} ref={loginFormRef} />}
    </div>
  );
};

export default Header;
