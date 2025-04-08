const config = require('./utils/config')
const { PubSub } = require('graphql-subscriptions')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')

const pubsub = new PubSub()

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
        { new: true, runValidators: true, context: 'query' }
      )
    },
  },
  Query: {
    allGenres: async () => {
      const allBooks = await Book.find({})
      return [...new Set(allBooks.flatMap((b) => b.genres))]
    },
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED'),
    },
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
  const bookAdded = await trySave(book)
  pubsub.publish('BOOK_ADDED', { bookAdded })
  return bookAdded
}

module.exports = resolvers
