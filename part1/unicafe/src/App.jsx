import { useState } from 'react'

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const addFeedback = (type) => {
        if (type === 'good')
        {
            setGood(good + 1);
        }
        if (type === 'neutral')
        {
            setNeutral(neutral + 1);
        }
        if (type === 'bad')
        {
            setBad(bad + 1);
        }
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>We value your feedback!</h1>
            <h3>How was your experience?</h3>
            <div>
                <DrawButton action={() => addFeedback('good')} text={'Good!'}/>
                <DrawButton action={() => addFeedback('neutral')} text={'Neutral'}/>
                <DrawButton action={() => addFeedback('bad')} text={'It was bad'}/>
            </div>
            <h1>Statistics so far:</h1>
            <div>
                <b>Good:</b> {good}<br/>
                <b>Neutral:</b> {neutral}<br/>
                <b>Bad:</b> {bad}<br/>

            </div>
        </div>
    )
}

const DrawButton = ({action, text}) => {
    return (
    <button onClick={action}>{text}</button>
    )
}

export default App