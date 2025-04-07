import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import LoginForm from './components/LoginForm.jsx'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

const Header = ({ token, setToken }) => {
  const client = useApolloClient()
  const navigate = useNavigate()
  const logout = () => {
    setToken(null)
    localStorage.removeItem('user-token')
    client.resetStore()
    navigate('/books')
  }
  return (
    <header>
      <button onClick={() => navigate('/')}>authors</button>
      <button onClick={() => navigate('/books')}>books</button>
      {token && (
        <button onClick={() => navigate('/recommended')}>recommended</button>
      )}
      {token && <button onClick={() => navigate('/add')}>add book</button>}
      <button onClick={() => (!token ? navigate('/login') : logout())}>
        {token ? 'log out' : 'login'}
      </button>
    </header>
  )
}

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('user-token'))
  return (
    <div>
      <Router>
        <Header token={token} setToken={setToken} />
        <Routes>
          <Route
            path="/login"
            element={<LoginForm token={token} setToken={setToken} />}
          />
          <Route path="/" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/recommended" element={<Books recommended={true} />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
