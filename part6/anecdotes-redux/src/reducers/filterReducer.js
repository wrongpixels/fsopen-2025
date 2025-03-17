import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        updateFilter(state, { payload }){
            return payload
        }
    }
})

export const { updateFilter } = filterSlice.actions
export default filterSlice.reducer