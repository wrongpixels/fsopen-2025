import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes.js'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, {payload}){
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
export const { appendAnecdote, vote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const addAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew({ content, votes: 0 })
    dispatch(appendAnecdote(newAnecdote))
  }
}

export default anecdoteSlice.reducer