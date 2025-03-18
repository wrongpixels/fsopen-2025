import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer.js'
import anecdoteService  from '../services/anecdotes.js'

const AnecdoteForm = () => {

    const newAnecdote = async (event) => {
        event.preventDefault()
        const newAnecdote = await anecdoteService.createNew({
            content: event.target.anecdote.value,
            votes: 0
        })
        dispatch(addAnecdote(newAnecdote))
        event.target.anecdote.value = ''
    }

    const dispatch = useDispatch()

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={newAnecdote}>
                <div><input name="anecdote"/></div>
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}
export default AnecdoteForm