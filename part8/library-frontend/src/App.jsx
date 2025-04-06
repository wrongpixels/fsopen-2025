import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
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
  }

  return (
    <header>
      <button onClick={() => navigate('/')}>authors</button>
      <button onClick={() => navigate('/books')}>books</button>
      <button onClick={() => navigate('/add')}>add book</button>
      <button
        onClick={() => {
          if (token) {
            return navigate('/login')
          }
          return logout
        }}
      >
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
        <Header />
        <Routes>
          <Route path="/" element={<Authors />} />
          <Route path="/books" element={<Books />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
