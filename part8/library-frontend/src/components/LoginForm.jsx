import { useInputField } from '../hooks/customFields.jsx'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../queries.js'

const LoginForm = ({ setToken }) => {
  const userField = useInputField()
  const navigate = useNavigate()
  const passwordField = useInputField('password')

  const [loginMutation] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setToken(data.login.value)
      localStorage.setItem('user-token', data.login.value)
      navigate('/books')
    },
  })

  const doLogin = (e) => {
    e.preventDefault()
    loginMutation({
      variables: {
        username: userField.value,
        password: passwordField.value,
      },
    })
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={doLogin}>
        <div>Username: {userField.field}</div>
        <div>Password: {passwordField.field}</div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
