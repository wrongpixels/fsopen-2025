import { useQuery, useMutation } from '@apollo/client'
import { useInputField, useSelectionField } from '../hooks/customFields.jsx'
import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from '../queries.js'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  const bornField = useInputField('number')
  const nameField = useSelectionField(
    result.data?.allAuthors?.map((a) => a.name) || [],
  )
  const [editYear, editResult] = useMutation(UPDATE_BIRTHYEAR, {
    onCompleted: () => {
      bornField.clean()
    },
  })

  if (result.loading) {
    return <>Loading data...</>
  }
  const authors = result.data.allAuthors

  const updateAuthor = (e) => {
    e.preventDefault()
    editYear({
      variables: {
        name: nameField.value?.value?.trim(),
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
