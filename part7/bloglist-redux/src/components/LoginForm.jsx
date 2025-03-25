import { useState, forwardRef, useImperativeHandle } from "react";

const LoginForm = forwardRef((props, refs) => {
  LoginForm.displayName = "LoginForm";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { showError, doLogin } = props;

  const cleanForm = () => {
    setPassword("");
    setUsername("");
  };
  useImperativeHandle(refs, () => ({ cleanForm }));

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      showError("Username and password can't be empty.");
      return;
    }
    doLogin(username, password);
  };

  return (
    <>
      <h2>Login to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            onChange={({ target }) => setUsername(target.value)}
            type="text"
            name="Username"
            value={username}
            data-testid="username"
          />
        </div>
        <div>
          Password
          <input
            onChange={({ target }) => setPassword(target.value)}
            type="password"
            name="Password"
            value={password}
            data-testid="password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
});

export default LoginForm;
