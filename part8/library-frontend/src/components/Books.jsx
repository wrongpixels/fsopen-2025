import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER, ALL_GENRES } from '../queries.js'
import { useState } from 'react'

const Books = ({ recommended = false }) => {
  const favQuery = useQuery(CURRENT_USER, { skip: !recommended })
  const [filter, setFilter] = useState(null)

  const actualFilter = recommended
    ? favQuery?.data?.me?.favoriteGenre
      ? favQuery.data.me.favoriteGenre
      : null
    : filter

  const result = useQuery(ALL_BOOKS, { variables: { genre: actualFilter } })
  const genresQuery = useQuery(ALL_GENRES)

  if (result.loading || favQuery?.loading || genresQuery?.loading) {
    return <>Loading data...</>
  }
  const books = result.data?.allBooks || []
  const genres = genresQuery.data?.allGenres

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
          {books.map((a) => (
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
