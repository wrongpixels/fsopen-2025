import axios from 'axios'

const URL = 'http://localhost:3001'

export const getAnecdotes = async () => {
    const response = await axios.get(`${URL}/anecdotes`)
    return response.data
}

export const addAnecdote = async (anecdote) => {
    const response = await axios.post(`${URL}/anecdotes`, anecdote)
    return response.data
}