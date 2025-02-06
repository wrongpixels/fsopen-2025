const {log, error} = require("../utils/logger");
const morgan = require("morgan");

morgan.token('body', (req) => req.body ? JSON.stringify(req.body) : '');
const morganFilter = (':method :url :status :res[content-length] - :response-time ms :body');

const morganLogger = () => morgan(morganFilter);
const errorHandler = (error, req, res, next) => {
    if (error?.name === 'CastError') {
        return res.status(400).json({ 'Error': 'Wrong entry ID format' });
    }
    if (error?.name === 'ReferenceError') {
        return res.status(404).json({ 'Error': 'Entry doesn\'t exist' });
    }
    if (error?.name === 'ValidationError') {
        return res.status(400).json(unPackErrorsAsString(error));
    }
    const status = error?.status || 500;
    if (error?.json) {
        return res.status(status).json(error.json);
    }
    res.status(status).json({ 'Error': 'An unexpected error occurred' });
    next(error);
};

const badRequestHandler = (req, res) =>
{
    res.status(404).json({ 'Error 404': 'Unknown endpoint' })
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
    return { [error.name]: message.trim() };
};

module.exports = { errorHandler, morganLogger, badRequestHandler }