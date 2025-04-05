const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    unique: true,
  },
  favoriteGenre: {
    type: String,
    minlength: 3,
    required: true,
  },
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
