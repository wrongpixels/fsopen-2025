const Header = (props) => <h1>{props.course.name}</h1>
const Content = (props) => {

    return (
        <div>
            {props.course.parts.map(part =>
                <Part key={part.id} part={part} />)
            }
        </div>
    )
}
const Part = props => <p>{props.part.name} {props.part.exercises}</p>
const Course = (props) => {

    return (
        <div>
            <Header course={props.course} />
            <Content course={props.course} />
        </div>
    )
}
export default Course