import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes.js'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, {payload}){
      state.push(payload)
    },
    replaceAnecdote(state, {payload}){
     return state.map(a => a.id === payload.id?payload:a)
    },
    setAnecdotes(state, {payload}){
      return payload
    }
  }

})
export const { appendAnecdote, replaceAnecdote, setAnecdotes } = anecdoteSlice.actions

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
const editAnecdote = async (anecdote, dispatch) => {
  await anecdoteService.replaceAnecdote(anecdote)
  dispatch(replaceAnecdote(anecdote))
}

export const voteAnecdote = (anecdote) =>
    async (dispatch) =>
        await editAnecdote({ ...anecdote, votes: anecdote.votes +1 }, dispatch)

export default anecdoteSlice.reducer