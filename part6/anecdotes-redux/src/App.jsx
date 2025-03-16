import { useSelector, useDispatch } from 'react-redux'
import { vote, addAnecdote } from './reducers/anecdoteReducer.js'

const App = () => {
  const anecdotes = useSelector(state => [...state].sort((a, b) => b.votes - a.votes))
  const dispatch = useDispatch()

  const newAnecdote = (event) => {
      event.preventDefault()
      dispatch(addAnecdote(event.target.anecdote.value))
      event.target.anecdote.value = ''
  }
  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => dispatch(vote(anecdote.id))}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div><input name="anecdote" /></div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default App