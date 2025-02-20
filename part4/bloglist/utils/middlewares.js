const morgan = require("morgan");

morgan.token('body', (req) => req.body ? JSON.stringify(req.body) : '');
const morganFilter = (':method :url :status :res[content-length] - :response-time ms :body');

const morganLogger = () => morgan(morganFilter);
const errorHandler = (error, req, res, next) => {
    console.log(error)
    const errorToSend = {code: error.status, message:error.message};

    if (error?.name === 'CastError') {
        errorToSend.message = 'Wrong entry ID format'
        errorToSend.code = 400
    }
    else if (error?.name === 'ReferenceError') {
       errorToSend.message = 'Entry doesn\'t exist'
       errorToSend.code = 404
    }
    else if (error?.name === "MongoServerError" && error?.message.includes('E11000 duplicate key error collection')) {
        errorToSend.message = 'User already exists'
        errorToSend.code = 400
    }
    else if (error?.name === 'ValidationError') {
        errorToSend.message = unPackErrorsAsString(error)
        errorToSend.code = 400
    }
    res.status(errorToSend.code).json({error: errorToSend.message})
    next(error);
};

const badRequestHandler = (req, res) =>
{
    res.status(404).json({ error: 'Unknown endpoint' })
}
/*
const unPackErrors = (error) => {
    let messages = {};
    if (error.errors) {
        Object.values(error.errors).forEach(errorDetail => {
            messages[errorDetail.path] = errorDetail.message;
        });
    }
    return { [error.name]: messages };
}; */

const unPackErrorsAsString = (error) => {
    let message = '';
    if (error.errors) {
        const errorMessages = Object.values(error.errors)
            .map(errorDetail => errorDetail.message
        );
        message = errorMessages.join(' ');
    }
    return message.trim();
};

module.exports = { errorHandler, morganLogger, badRequestHandler }