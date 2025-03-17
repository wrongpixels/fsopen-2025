const filterReducer = (state = '', {type, payload}) => {
    switch (type){
        case 'UPDATE_FILTER': return payload
        default: return state
    }
}

export const updateFilter = (value) => ({
    type: 'UPDATE_FILTER',
    payload: value
})

export default filterReducer