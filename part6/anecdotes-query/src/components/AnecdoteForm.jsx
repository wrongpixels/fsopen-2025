import { addAnecdote } from '../requests.js'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { setNotification, formatTitle } from '../utils/notification'
import { useDispatch } from '../NotificationContext'

const AnecdoteForm = () => {

    const queryClient = useQueryClient()
    const dispatchNotification = useDispatch()
    const addAnecdoteMutation = useMutation({
        mutationKey:'anecdotes',
        mutationFn: addAnecdote,
        onSuccess: (newAnecdote) => {
            queryClient.setQueryData(['anecdotes'],
                queryClient
                .getQueryData(['anecdotes'])
                .concat(newAnecdote))
        }
    })

    const onCreate = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        addAnecdoteMutation.mutate({content, votes: 0})
        event.target.anecdote.value = ''
        setNotification(dispatchNotification, `Anecdote ${formatTitle(content)} added!`, 5)

    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name='anecdote'/>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
