import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import anecdoteService from './services/anecdotes.js'
import { setAnecdotes } from './reducers/anecdoteReducer.js'
import AnecdoteForm from './components/AnecdoteForm.jsx'
import AnecdoteList from './components/AnecdoteList.jsx'
import Filter from './components/Filter.jsx'
import Notification from './components/Notification.jsx'

const App = () => {
    const dispatch = useDispatch()
    const fetchAnecdotes = async () => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
    useEffect(() => {
        fetchAnecdotes()
    }, []);
  return (
    <div>
      <h2>Anecdotes</h2>
        <Notification />
        <Filter />
        <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App