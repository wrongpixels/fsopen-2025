import { addAnecdote } from '../requests.js'
import { useQueryClient, useMutation } from '@tanstack/react-query'

const AnecdoteForm = () => {

    const queryClient = useQueryClient()

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
