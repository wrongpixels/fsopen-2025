import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './queries.js'
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

export const updateBookCache = (cache, query, newBook) => {
  cache.updateQuery(
    {
      query,
      variables: { genre: null },
    },
    (currentCache) => {
      if (!currentCache.allBooks.find((b) => b.title === newBook.title)) {
        return { allBooks: currentCache.allBooks.concat(newBook) }
      }
      return currentCache
    }
  )
}

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
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(data.data.bookAdded)
      updateBookCache(client.cache, ALL_BOOKS, data.data.bookAdded)
    },
  })
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
