import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer.js'
import blogsReducer from './reducers/blogsReducer.js'
import useReducer from './reducers/userReducer.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    user: useReducer,
  },
})

export default store
