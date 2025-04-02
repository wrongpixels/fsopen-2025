const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const typeDefs = /* GraphQL */ `
  enum Genre {
    classic
    revolution
    crime
    design
    refactoring
    patterns
    agile
  }

  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID
    genres: [Genre!]!
  }

  type Author {
    name: String!
    id: ID
    born: Int
    bookCount: Int!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
  }
`
const throwError = (message, code = '', invalidArgs = '') => {
  const extensions =
    !code && !invalidArgs ? null : { extensions: { code, invalidArgs } }
  throw new GraphQLError(message, extensions)
}

const addAuthor = (name, born = null) => {
  const author = { name, id: uuid(), born }
  authors = authors.concat(author)
  return author
}

const addBook = (title, author, published, genres) => {
  const book = { title, author, published, id: uuid(), genres }
  books = books.concat(book)
  return book
}

const resolvers = {
  Mutation: {
    addBook: (root, { title, author, published, genres }) => {
      if (!author || !title || !published || !genres) {
        throwError('Cannot add a book without all basic info', 'MISSING_DATA')
      }
      if (books && books.find((b) => b.title === title)) {
        throwError('Book already exists', 'EXISTING_DATA', title)
      }
      if (!authors.find((a) => a.name === author)) {
        addAuthor(author)
      }
      return addBook(title, author, published, genres)
    },
  },
  Query: {
    bookCount: () => (books ? books.length : 0),
    authorCount: () => (authors ? authors.length : 0),
    allBooks: (root, args) => {
      return (
        args.author ? books.filter((b) => b.author === args.author) : books
      ).filter((b) => (args.genre ? b.genres.includes(args.genre) : true))
    },
    allAuthors: () => authors,
  },
  Author: {
    bookCount: (root) =>
      books ? books.filter((b) => b.author === root.name).length : 0,
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
