require('express-async-errors')
const express = require('express')
const config = require('./utils/config')
const mongoose = require('mongoose')
const cors = require('cors')
const middleware = require('./utils/middleware')
const {log, error} = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.connect(config.MONGODB_URL)
    .then(() => log('Connected to Mongoose'))
    .catch(() => error('Error connecting to Mongoose'));

mongoose.set('strictQuery', false);

const app = express();
app.use(cors());
app.use(express.json())
app.use(middleware.tokenExtractor)
if (process.env.NODE_ENV !=='test') {
    app.use(middleware.morganLogger());
}
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use(middleware.badRequestHandler)
app.use(middleware.errorHandler)

module.exports = app;