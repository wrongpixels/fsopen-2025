import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, {payload}){
      state.push(payload)
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