require("express-async-errors")
const express = require("express");
const config = require("./utils/config");
const mongoose = require("mongoose");
const cors = require("cors");
const middlewares = require("./utils/middlewares");
const {log, error} = require("./utils/logger");
const router = require("./controllers/blogs");

mongoose.connect(config.MONGODB_URL)
    .then(() => log('Connected to Mongoose'))
    .catch(() => error('Error connecting to Mongoose'));

mongoose.set('strictQuery', false);

const app = express();
app.use(cors());
app.use(express.json())
if (process.env.NODE_ENV !=='test') {
    app.use(middlewares.morganLogger());
}
app.use('/api/blogs', router);
app.use(middlewares.badRequestHandler);
app.use(middlewares.errorHandler);

module.exports = app;