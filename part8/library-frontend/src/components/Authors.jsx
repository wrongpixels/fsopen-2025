import { useQuery, useMutation } from '@apollo/client'
import { useInputField } from '../hooks/inputField.jsx'
import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from '../queries.js'

const Authors = () => {
  const nameField = useInputField()
  const bornField = useInputField('number')
  const [editYear, editResult] = useMutation(UPDATE_BIRTHYEAR, {
    onCompleted: () => {
      nameField.clean()
      bornField.clean()
    },
  })

  const result = useQuery(ALL_AUTHORS)
  if (result.loading) {
    return <>Loading data...</>
  }
  const authors = result.data.allAuthors

  const updateAuthor = (e) => {
    e.preventDefault()
    editYear({
      variables: {
        name: nameField.value?.trim(),
        born: Number(bornField.value),
      },
    })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={updateAuthor}>
        <h2>Set birthyear</h2>
        <div>Name: {nameField.field}</div>
        <div>Born: {bornField.field}</div>
        <button type="submit">Update author</button>
      </form>
    </div>
  )
}

export default Authors
