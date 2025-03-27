import { useRef } from "react";
import LoginForm from "./LoginForm.jsx";
import useNotification from "../hooks/useNotification.js";
import useActiveUser from "../hooks/useActiveUser.js";

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

  if (!user) {
    return (
      <>
        <LoginForm setSession={setSession} ref={loginFormRef} />
      </>
    );
  }
  return (
    <div>
      <h2>Blogs</h2>
      <p>
        Logged in as <b> {user.username} </b>
        <button onClick={resetSession}>Log out</button>
      </p>
    </div>
  );
};

export default Header;
