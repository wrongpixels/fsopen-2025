import loginService from '../services/login.js'
import { useState, forwardRef, useImperativeHandle } from 'react'

const LoginForm = forwardRef((props, refs) => {
  LoginForm.displayName = 'LoginForm'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const{ showError, setSession } = props

  const cleanForm = () => {
    setPassword('')
    setUsername('')
  }
  useImperativeHandle(refs, () => ({ cleanForm }))

  const doLogin = async (event) => {
    event.preventDefault()
    if (!username || !password)
    {
      showError('Username and password can\'t be empty.')
      return
    }
    const userData = await loginService.tryLogin(username, password)
    if (userData === null)
    {
      showError('Login failed.')
      return
    }
    if (userData.error)
    {
      showError(userData.error)
      return
    }
    if (!userData.token)
    {
      showError('Token is not valid.')
      return
    }
    setSession(userData)
  }

  return (
    <>
      <h2>Login to application</h2>
      <form onSubmit={doLogin}>
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
  )

})

export default LoginForm