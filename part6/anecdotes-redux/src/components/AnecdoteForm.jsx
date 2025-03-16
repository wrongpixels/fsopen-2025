import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer.js'

const AnecdoteForm = () => {

    const newAnecdote = (event) => {
        event.preventDefault()
        dispatch(addAnecdote(event.target.anecdote.value))
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