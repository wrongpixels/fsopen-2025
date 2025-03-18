import { createSlice } from '@reduxjs/toolkit'
import store from '../store.js'

const notificationSlicer = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        runNotification(state, { payload }){
          return payload
        },
        resetNotification(){
            return ''
        }
    }
})
export const { runNotification, resetNotification } = notificationSlicer.actions

let currentTimeout = null

export const setNotification = (message, time) => {
    return async (dispatch) => {
        if (currentTimeout)
        {
            clearTimeout(currentTimeout)
        }
        dispatch(runNotification(message))
        currentTimeout = setTimeout(() => {
            dispatch(resetNotification())
        }, time*1000)
    }
}

export default notificationSlicer.reducer