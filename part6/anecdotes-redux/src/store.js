import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer from './reducers/anecdoteReducer.js'
import filterReducer from './reducers/filterReducer.js'

const store = configureStore ({
    reducer: {
        anecdotes: anecdoteReducer,
        filter: filterReducer
    }
})
export default store



