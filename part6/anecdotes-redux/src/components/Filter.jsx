import { updateFilter } from '../reducers/filterReducer.js'
import { useDispatch } from 'react-redux'

const Filter = () => {

    const dispatch = useDispatch()
    const handleChange = (event) => dispatch(updateFilter(event.target.value))

    const filterStyle = {
        marginBottom: 10
    }

    return (
        <div style={filterStyle}>
            Filter:
            <input
                name="filter"
                onChange={handleChange}
            />
        </div>
    )
}

export default Filter