const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

mongoose.set('strictQuery', false)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to Mongoose'))
  .catch(() => console.log('Error connecting to Mongoose'))

const typeDefs = /* GraphQL */ `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

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
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token

    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Mutation: {
    createUser: async (root, { username, favoriteGenre }) => {
      const newUser = new User({ username, favoriteGenre })
      return await trySave(newUser)
    },
    login: async (root, { username, password }) => {
      if (!username || !password) {
        throwError('Missing login data', 'MISSING_LOGIN_DATA')
      }
      const user = await User.findOne({ username })
      if (!user || password !== 'secret') {
        throwError('Username or password is so wrong!', 'WRONG_LOGIN_DATA')
      }
      const tokenData = { username: user.username, id: user._id }
      return { value: jwt.sign(tokenData, config.SECRET) }
    },
    addBook: async (root, { title, author, published, genres }, context) => {
      checkLogin(context)
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
    editAuthor: async (root, { name, setBornTo }, context) => {
      checkLogin(context)
      return Author.findOneAndUpdate(
        { name },
        { born: setBornTo },
        { new: true, runValidators: true, context: 'query' },
      )
    },
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      if (author || genre) {
        const filter = {}
        if (author) {
          const bookAuthor = await Author.findOne({ name: author })
          if (bookAuthor) {
            filter.author = bookAuthor._id
          } else {
            return []
          }
        }
        if (genre) {
          filter.genres = genre
        }
        return Book.find(filter).populate('author')
      }
      return Book.find({}).populate('author')
    },
    me: (root, args, { currentUser }) => currentUser,
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (root) =>
      Book.collection.countDocuments({ author: root._id }),
  },
}

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
    throwError(e.message, 'MONGOOSE_ERROR', '', e)
  }
}

const checkLogin = (context) => {
  if (!context?.currentUser) {
    throwError('Authentication error: No active session found', 'INVALID_TOKEN')
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
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: config.PORT },
  context: async ({ req }) => {
    const token = req?.headers?.authorization?.includes('Bearer ')
      ? jwt.verify(req.headers.authorization.substring(7), config.SECRET)
      : null
    const currentUser = token ? await User.findById(token.id) : null
    return { currentUser: currentUser || null }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
