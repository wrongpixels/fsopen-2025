import {useState, forwardRef, useImperativeHandle} from 'react'

const Toggleable = forwardRef((props, refs) => {
        const {
            labelOnVisible = 'Hide',
            labelOnInvisible = 'Show',
            initialVisibility = false,
            addSpace = true,
            showOver = false,
            children
        } = props
        const [visibility, setVisibility] = useState(initialVisibility)
        const toggleVisibility = () => setVisibility(!visibility)

        const drawButton = () => <button
            onClick={toggleVisibility}>{visibility ? labelOnVisible : labelOnInvisible}</button>

        const visibilityStyle = () => ({display: visibility ? '' : 'none'})
        const addBreak =(<><br/><br/></>)


    useImperativeHandle(refs, () => ({toggleVisibility}))

        return (
            <>
                {showOver && drawButton()}
                <div style={visibilityStyle()}>
                    {children}
                </div>
                {!showOver && drawButton()}
                {addSpace?addBreak:<></>}
            </>
        )
    }
)

export default Toggleable
