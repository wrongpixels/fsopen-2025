import loginService from "../services/login.js";
import useNotification from "../hooks/useNotification.js";
import useInputField from "../hooks/useInputField.js"
import { useState, forwardRef, useImperativeHandle } from "react";

const LoginForm = forwardRef((props, refs) => {
  const { showError } = useNotification();
  LoginForm.displayName = "LoginForm";
  const [username, userProps, userFunctions] = useInputField("text", "Username", "", "username")
  const [password, passProps, passFunctions] = useInputField("password", "Password", "", "password")
  const { setSession } = props;

  const cleanForm = () => {
    passFunctions.clean()
    userFunctions.clean()
  };
  useImperativeHandle(refs, () => ({ cleanForm }));

  const doLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      showError("Username and password can't be empty.");
      return;
    }
    const userData = await loginService.tryLogin(username, password);
    if (userData === null) {
      showError("Login failed.");
      return;
    }
    if (userData.error) {
      showError(userData.error);
      return;
    }
    if (!userData.token) {
      showError("Token is not valid.");
      return;
    }
    setSession(userData);
  };

  return (
    <>
      <h2>Login to application</h2>
      <form onSubmit={doLogin}>
        <div>
          Username
          <input
              {...userProps}
          />
        </div>
        <div>
          Password
          <input
              {...passProps}
          />
        </div>
        <p>
          <button type="submit">Login</button>
        </p>
      </form>
    </>
  );
});

export default LoginForm;
