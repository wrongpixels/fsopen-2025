import { useState } from 'react'

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalVoteValues, setVoteValues] = useState(0);
    const addFeedback = (vote) => {
        const newTotal = total + 1;
        setTotal(newTotal);
        setVoteValues(totalVoteValues + vote);
        if (vote === 1)
        {
            setGood(good + 1);
        }
        if (vote === 0)
        {
            setNeutral(neutral + 1);
        }
        if (vote === -1)
        {
            setBad(bad + 1);
        }
    }
    const average = total === 0? '-': totalVoteValues / total;
    const percentage = total===0? '- ': good * 100 / total;

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>We value your feedback!</h1>
            <h3>How was your experience?</h3>
            <div>
                <DrawButton action={() => addFeedback(1)} text={'Good!'}/>
                <DrawButton action={() => addFeedback(0)} text={'Neutral'}/>
                <DrawButton action={() => addFeedback(-1)} text={'It was bad'}/>
            </div>
            <h1>Statistics so far:</h1>
            <div>
                <b>Good:</b> {good}<br/>
                <b>Neutral:</b> {neutral}<br/>
                <b>Bad:</b> {bad}<br/>
                <p>
                    <b>Total Feedback:</b> {total}<br/>
                    <b>Average Score: </b> {average}<br/>
                    <b>Positive: </b> {percentage}%
                </p>
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