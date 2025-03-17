import { createSlice } from '@reduxjs/toolkit'

const notificationSlicer = createSlice({
    name: 'notification',
    initialState: '',
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