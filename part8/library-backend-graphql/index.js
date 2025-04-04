const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')
const config = require('./utils/config')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

mongoose.set('strictQuery', false)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to Mongoose'))
  .catch(() => console.log('Error connecting to Mongoose'))

const typeDefs = /* GraphQL */ `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID
    genres: [String!]!
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
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`
const throwError = (message, code = '', invalidArgs = '', error = null) => {
  const extensions =
    !code && !invalidArgs ? null : { extensions: { code, invalidArgs, error } }
  throw new GraphQLError(message, extensions)
}
const trySave = async (element, value = 'value') => {
  try {
    await element.save()
    return element
  } catch (e) {
    throwError(`Saving ${value} failed`, 'BAD_USER_INPUT', value, e)
  }
}

const addAuthor = async (name, born = null) => {
  const author = new Author({ name, born })
  return trySave(author)
}

const addBook = async (title, author, published, genres) => {
  const book = new Book({ title, author, published, genres })
  return trySave(book)
}

const resolvers = {
  Mutation: {
    addBook: async (root, { title, author, published, genres }) => {
      if (!author || !title || !published || !genres) {
        throwError('Cannot add a book without all basic info', 'MISSING_DATA')
      }
      if (genres.length === 0) {
        throwError('You need to set at least a genre', 'MISSING_DATA')
      }
      if (await Book.findOne({ title })) {
        throwError('Book already exists', 'EXISTING_DATA', title)
      }
      let bookAuthor = await Author.findOne({ name: author })
      if (!bookAuthor) {
        bookAuthor = await addAuthor(author)
      }
      return addBook(title, bookAuthor, published, genres)
    },
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name)
      if (!author) {
        return null
      }
      const editAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((a) => (a.id === editAuthor.id ? editAuthor : a))
      return editAuthor
    },
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async () => Book.find({}),
    /*{
      return (
        args.author
          ? books.filter((b) => b.author === args.author)
          : Book.find({})
      ).filter((b) => (args.genre ? b.genres.includes(args.genre) : true))
    }*/ allAuthors: async () => Author.find({}),
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
  listen: { port: config.PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
