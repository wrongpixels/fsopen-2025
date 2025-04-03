import { gql } from '@apollo/client'

const authorStructure = `name
id
born
bookCount`

export const ALL_AUTHORS = gql`
    query {
        allAuthors{
            ${authorStructure}
        }
    }
`
