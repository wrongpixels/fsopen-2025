import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries.js'
import { useState } from 'react'

const Books = () => {
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)
  if (result.loading) {
    return <>Loading data...</>
  }
  const books = result.data?.allBooks || []
  let filteredBooks = filter
    ? books.filter((b) => b.genres.includes(filter))
    : books
  const genres = [...new Set(books.flatMap((b) => b.genres))]

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Genre filter</h3>
      <button onClick={() => setFilter(null)}>all</button>
      {genres.map((g) => (
        <button key={g} onClick={() => setFilter(g)}>
          {g}
        </button>
      ))}
    </div>
  )
}

export default Books
