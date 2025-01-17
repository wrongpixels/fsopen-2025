const Header = (props) => {
  return (
  <>
    <h1>{props.course}</h1>
  </>
  )
}

const Content = (props) => {

  return (
    <>
      <Part part={props.parts.part1} />
      <Part part={props.parts.part2} />
      <Part part={props.parts.part3} />
    </>
  )
}

const Total = (props) => {

  return (
    <>
      <p>Number of exercises {props.parts.part1.exercises + props.parts.part2.exercises + props.parts.part3.exercises}</p>
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.part.name} {props.part.exercises}</p>      
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = {
    part1: { name: 'Fundamentals of React', exercises: 10 },
    part2: { name: 'Using props to pass data', exercises: 7 },
    part3: { name: 'State of a component', exercises: 14 }
  } 

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
export default App