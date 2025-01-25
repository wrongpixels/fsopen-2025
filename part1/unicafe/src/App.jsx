import { useState } from 'react'

const Statistics = (props) => {
    if (props.total === 0)
    {
        return (
            <>
            <h1>Statistics so far:</h1>
                <h3><b>No feedback provided yet</b></h3>
                Vote to be the first!
        </>
        )
    }
    return (
        <>
            <h1>Statistics so far:</h1>
            <div>
                <StatisticLine text={'Good'} value={props.good} />
                <StatisticLine text={'Neutral'} value={props.neutral} />
                <StatisticLine text={'Bad'} value={props.bad} />
                <p>
                    <StatisticLine text={'Total Feedback'} value={props.total} />
                    <StatisticLine text={'Average Score'} value={props.average} />
                    <StatisticLine text={'Positive'} value={props.percentage+'%'} />
                </p>
            </div></>
    )
}

const StatisticLine = ({text, value}) => {
    return (<>
        <b>{text}:</b> {value}<br/></>
    )
}
const Button = ({action, text}) => {
    return (
        <button onClick={action}>{text}</button>
    )
}
const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const [totalVoteValues, setVoteValues] = useState(0);
    const addFeedback = (vote) => {
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
    const total = good + bad + neutral;
    const average = total === 0? '-': totalVoteValues / total;
    const percentage = total===0? '- ': good * 100 / total;

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>We value your feedback!</h1>
            <h3>How was your experience?</h3>
            <div>
                <Button action={() => addFeedback(1)} text={'Good!'}/>
                <Button action={() => addFeedback(0)} text={'Neutral'}/>
                <Button action={() => addFeedback(-1)} text={'It was bad'}/>
            </div>
            <Statistics good={good} neutral={neutral} bad={bad} average={average} percentage={percentage} total={total} />
        </div>
    )
}


export default App