import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer.js'

const Anecdote = ({anecdote, handleVote }) =>
{
    return (
        <li>
            <div>
                {anecdote.content}
            </div>
            <div>
                has: {anecdote.votes}
                <button onClick={handleVote} >Vote</button>
            </div>
        </li>
    )
}
const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => [...state].sort((a, b) => b.votes - a.votes))
    return (
        <div><ul>
            {anecdotes.map(a =>
                <Anecdote
                    key={a.id}
                    anecdote={a}
                    handleVote={() => dispatch(vote(a.id))}
                /> )}
        </ul>
        </div>
    )
}

export default AnecdoteList