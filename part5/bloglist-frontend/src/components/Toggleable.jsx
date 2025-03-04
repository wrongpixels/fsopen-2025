import {useState, forwardRef, useImperativeHandle} from 'react'

const Toggleable = forwardRef((props, refs) =>{
    const {labelOnVisible = 'Hide',
        labelOnInvisible = 'Show',
        initialVisibility = false,
        children} = props
    const [visibility, setVisibility] = useState(initialVisibility)
    const toggleVisibility = () => setVisibility(!visibility)

    const visibilityStyle = () => ({display: visibility?'':'none'})

    useImperativeHandle(refs, () => ({toggleVisibility}))

    return (
        <>
            <div style={visibilityStyle()} >
                {children}
            </div>
            <br/>
            <button onClick={toggleVisibility}>{visibility?labelOnVisible:labelOnInvisible}</button>
        </>
    )
    }
)

export default Toggleable
