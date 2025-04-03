import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  return (
    <header>
      <button onClick={() => navigate('/')}>authors</button>
      <button onClick={() => navigate('/books')}>books</button>
      <button onClick={() => navigate('/add')}>add book</button>
    </header>
  )
}

const App = () => {
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
