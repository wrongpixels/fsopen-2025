import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries.js'
import { useState, useEffect } from 'react'

const Books = ({ recommended = false }) => {
  const favQuery = useQuery(CURRENT_USER, { skip: !recommended })
  const [filter, setFilter] = useState(null)
  const result = useQuery(ALL_BOOKS)

  if (result.loading || favQuery?.loading) {
    return <>Loading data...</>
  }

  const actualFilter = recommended
    ? favQuery?.data.me
      ? favQuery.data.me.favoriteGenre
      : null
    : filter

  const books = result.data?.allBooks || []
  let filteredBooks = actualFilter
    ? books.filter((b) => b.genres.includes(actualFilter))
    : books
  const genres = [...new Set(books.flatMap((b) => b.genres))]

  return (
    <div>
      <h2>{recommended ? 'recommendations' : 'books'}</h2>
      {recommended && (
        <div>
          based on your favorite genre '<b>{actualFilter}</b>'
        </div>
      )}
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
      {!recommended && (
        <div>
          <h3>Genre filter</h3>
          <button onClick={() => setFilter(null)}>all</button>
          {genres.map((g) => (
            <button key={g} onClick={() => setFilter(g)}>
              {g}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Books
