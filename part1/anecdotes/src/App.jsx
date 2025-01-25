import { useState } from 'react'

const getRandomInRange = (min, max) => {

        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

const App = () => {
    const anecdotes = [
        'If it hurts, do it more often.',
        'Adding manpower to a late software project makes it later!',
        'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
        'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
        'Premature optimization is the root of all evil.',
        'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
        'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
        'The only way to go fast, is to go well.'
    ]

    const [selected, setSelected] = useState(0);
    const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));
    const setRandomAnecdote = () => {
        const index = getRandomInRange(0, anecdotes.length-1);
        setSelected(index);
    }
    const voteCurrentAnecdote = () => {
        const [...newVotes] = votes;
        newVotes[selected] += 1;
        setVotes(newVotes);
    }
    const currentVotes = votes[selected];
    let mostVoted = -1;
    votes.map((value, index) => {
        if (value > 0)
        {
            if (mostVoted === -1)
            {
                mostVoted = index;
            }
            if (value > votes[mostVoted])
            {
                mostVoted = index;
            }
        }
    })
    return (
        <div style={{textAlign: 'center'}}>
            <h1>Anecdote of the Day:</h1>
            <DrawQuote anecdotes={anecdotes} index={selected} mostVotedMode={false}/>
            <p>
                <i>(Voted <b>{currentVotes}</b> times)</i>
            </p>
            <p>
                <DrawButton action={voteCurrentAnecdote} text={'Vote this Anecdote!'}/>
                <DrawButton action={setRandomAnecdote} text={'Get next Anecdote'}/>
            </p>
            <h1>Most Voted Anecdote:</h1>
            <DrawQuote anecdotes={anecdotes} index={mostVoted} mostVotedMode={true}/>
        </div>
    )
}
const DrawButton = ({action, text}) => {
    return (
        <button onClick={action}>{text}</button>
    )
}

const DrawQuote = ({anecdotes, index, mostVotedMode}) =>{
    if (mostVotedMode && index === -1)
    {
        return (
            <>No votes yet!</>
        )
    }
    return (
        <h4><b>"</b>{anecdotes[index]}<b>"</b></h4>
    )
}

export default App