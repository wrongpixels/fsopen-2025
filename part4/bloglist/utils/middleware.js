const morgan = require("morgan");

morgan.token('body', (req) => req.body ? JSON.stringify(req.body) : '');
const morganFilter = (':method :url :status :res[content-length] - :response-time ms :body');

const morganLogger = () => morgan(morganFilter);

const tokenExtractor = (req, res, next) => {
    const token = req.get('authorization')
    if (token)
    {
        if (token.startsWith('Bearer '))
        {
            req.token = token.replace('Bearer ', '')
        }
    }
    next()
}

const errorHandler = (error, req, res, next) => {
   // console.log('Current error:', error)
    const errorToSend = {code: error.status, message:error.message}

    errorToSend.setError = (code, message) => {
        errorToSend.code = code
        errorToSend.message = message
    }

    if (error?.name === 'CastError') {
        errorToSend.setError(400, 'Wrong entry ID format')
    }
    else if (error?.name === 'ReferenceError') {
        errorToSend.setError(404, 'Entry doesn\'t exist')
    }
    else if (error?.name === "MongoServerError" && error?.message.includes('E11000 duplicate key error collection')) {
        errorToSend.setError(400, 'User already exists')
    }
    else if (error?.name === 'ValidationError') {
        errorToSend.setError(400, unPackErrorsAsString(error))
    }
    else if (error?.name === 'TokenExpiredError')
    {
        errorToSend.setError(401, 'Token expired')
    }
    else if (error?.name === 'JsonWebTokenError')
    {
        errorToSend.setError(401, 'Invalid token')
    }
    if (errorToSend.code && errorToSend.message)
    {
        return  res.status(errorToSend.code).json({error: errorToSend.message})
    }
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

module.exports = { errorHandler, morganLogger, badRequestHandler, tokenExtractor }