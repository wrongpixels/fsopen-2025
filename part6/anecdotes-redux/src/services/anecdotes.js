import axios from 'axios'

const URL = 'http://localhost:3001'

const getAll = async () => {
    const response = await axios.get(`${URL}/anecdotes`)
    return response.data
}

export default {getAll}