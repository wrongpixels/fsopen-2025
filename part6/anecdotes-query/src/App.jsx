import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { setNotification, formatTitle } from './utils/notification.js'
import { useDispatch } from './NotificationContext.jsx'
import { getAnecdotes, editAnecdote } from './requests.js'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const App = () => {

  const queryClient = useQueryClient()
  const dispatchNotification = useDispatch()
  const editAnecdoteMutation = useMutation({
    mutationKey: 'anecdotes',
    mutationFn: editAnecdote,
    onSuccess: (edited) => {
      queryClient.setQueryData(['anecdotes'], queryClient
          .getQueryData(['anecdotes'])
          .map(a => a.id === edited.id?edited:a))
    }
  })

  const { isLoading, isError, data } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 2,
    refetchOnWindowFocus: false
  })

  if (isLoading)
  {
    return (<h3>Loading data…</h3>)
  }
  else if (isError)
  {
    return (<h3>Anecdote service is not available due to problems in server</h3>)
  }

  const anecdotes = data

  const handleVote = (anecdote) => {
    editAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    setNotification(dispatchNotification, `Anecdote ${formatTitle(anecdote.content)} voted!`, 5)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
