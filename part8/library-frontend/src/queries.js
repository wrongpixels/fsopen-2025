import { gql } from '@apollo/client'

const authorStructure = `name
id
born
bookCount`

const bookStructure = `title
published
author{
${authorStructure}
}
id
genres`

export const CURRENT_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

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
export const ADD_BOOK = gql`
    mutation newBook ($title: String!, $author: String!, $published: Int!, $genres: [String!]!){
        addBook(author: $author, title: $title, published: $published, genres: $genres){
            ${bookStructure}
        }
    }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const UPDATE_BIRTHYEAR = gql`
mutation updateAuthorBirth ($name: String!, $born: Int!){
    editAuthor(name: $name, setBornTo: $born){
        ${authorStructure}
    }
}
`
