const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)
export const vote = (id) => ({type: 'VOTE_ANECDOTE', payload: {id}})

export const addAnecdote = (anecdote) => {
  return {
    type: 'ADD_ANECDOTE',
    payload: asObject(anecdote)
  }
}
const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = initialState, {type, payload}) => {
  switch (type){
    case 'VOTE_ANECDOTE': return state.map(a => a.id === payload.id?{...a, votes:a.votes+1}:a)
    case 'ADD_ANECDOTE': return [...state, payload]
    default: return state
  }
}

export default anecdoteReducer