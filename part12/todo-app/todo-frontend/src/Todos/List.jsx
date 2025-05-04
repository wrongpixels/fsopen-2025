import Todo from './Todo'

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  const onClickDelete = (todo) => () => {
    deleteTodo(todo)
  }

  const onClickComplete = (todo) => () => {
    completeTodo(todo)
  }

  return (
    <>
      {todos.map((todo, i) => (
       
        <span key={`${todo._id}`}> <hr />
          <Todo todo={todo} onClickDelete={onClickDelete} onClickComplete={onClickComplete} />
        </span>
      ))}
    </>
  )}
export default TodoList
