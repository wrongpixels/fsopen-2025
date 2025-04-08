const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const mongoose = require('mongoose')
const User = require('./models/user')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

mongoose.set('strictQuery', false)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to Mongoose'))
  .catch(() => console.log('Error connecting to Mongoose'))

start = async () => {
  const app = express()
  const httpServer = http.createServer(app)
  const WsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const activeWs = useServer({ schema }, WsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await activeWs.dispose()
            },
          }
        },
      },
    ],
  })
  await server.start()
  app.use(cors())
  app.use(express.json())
  app.use(
    '/',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const userId = req?.headers?.authorization?.includes('Bearer ')
          ? jwt.verify(req.headers.authorization.substring(7), config.SECRET).id
          : null
        if (userId) {
          const currentUser = await User.findById(userId)
          return { currentUser }
        }
      },
    })
  )
  httpServer.listen(config.PORT, () =>
    console.log(`Server is now running on http://localhost:${config.PORT}`)
  )
}

start()
