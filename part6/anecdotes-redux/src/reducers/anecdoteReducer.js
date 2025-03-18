import { createSlice } from '@reduxjs/toolkit'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, {payload}){
      state.push(asObject(payload))
    },
    vote(state, {payload}){
      const target = state.find(a => a.id === payload)
      target.votes +=1
    },
    setAnecdotes(state, {payload}){
      return payload
    }
  }

})
export const { addAnecdote, vote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer