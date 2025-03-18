import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer.js'
import { setNotification, resetNotification } from '../reducers/notificationReducer.js'

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

    const runNotification = (message) =>{
        dispatch(setNotification(message))
        setTimeout(() =>
        {
            dispatch(resetNotification())
        }, 5000)
    }

    const doVote = (anecdote) => {
        dispatch(vote(anecdote.id))
        const trimmedAnecdote = anecdote.content.length>70?`${anecdote.content.substring(0, 70)}...`:anecdote.content
        runNotification(`You voted for '${trimmedAnecdote}'`)
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