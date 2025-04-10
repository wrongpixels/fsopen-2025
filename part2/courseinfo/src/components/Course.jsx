const Header = ({name}) => <h2>{name}</h2>
const Content = ({parts}) => {

    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part} />)
            }
        </div>
    )
}
const Total = ({parts}) => {
    const total = parts.reduce((operation, part) => operation + part.exercises, 0);
    return (
        <><b>Total of {total} exercises</b></>
    )
}
const Part = ({part}) => <p>{part.name} {part.exercises}</p>
const Course = ({course}) => {
    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}
export default Course