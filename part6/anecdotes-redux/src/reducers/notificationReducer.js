import { createSlice } from '@reduxjs/toolkit'

const notificationSlicer = createSlice({
    name: 'notification',
    initialState: 'This is a notification!',
    reducers: {
        setNotification(state, { payload }){
          return payload
        },
        resetNotification(){
            return ''
        }
    }
})

export const { setNotification, resetNotification } = notificationSlicer.actions
export default notificationSlicer.reducer