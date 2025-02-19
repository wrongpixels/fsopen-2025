const mongoose = require('mongoose')
const Blog = require('./blog')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Blog
    }
})

userSchema.set('toJSON', {
    transform: (doc, res) => {
        res.id = res._id.toString()
        delete res.passwordHash
        delete res._id
        delete res.__v
}
})

module.exports = mongoose.model('User', userSchema)