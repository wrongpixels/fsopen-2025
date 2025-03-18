import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification } from '../reducers/notificationReducer.js'

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

    const doVote = (anecdote) => {
        dispatch(voteAnecdote(anecdote))
        const trimmedAnecdote = anecdote.content.length>70?`${anecdote.content.substring(0, 70)}...`:anecdote.content
        dispatch(setNotification(`You voted for '${trimmedAnecdote}'`, 10))
    }
    const anecdotes = useSelector(({ anecdotes, filter }) => [...anecdotes]
        .filter(a => a.content && a.content
            .toLowerCase()
            .includes(filter
                .toLowerCase()))
        .sort((a, b) => b.votes - a.votes))
    return (
        <div><ul>
            {anecdotes.map(a =>
                <Anecdote
                    key={a.id}
                    anecdote={a}
                    handleVote={() => doVote(a)}
                /> )}
        </ul>
        </div>
    )
}

export default AnecdoteList