import { gql } from '@apollo/client'

const authorStructure = `name
id
born
bookCount`

const bookStructure = `title
published
author
id
genres`

export const ALL_BOOKS = gql`
query {
    allBooks {
        ${bookStructure}
    }
}
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors{
            ${authorStructure}
        }
    }
`
