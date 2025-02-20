const Blog = require('../models/blog')
const User = require('../models/user')

const getAllBlogsInDB = async () => {
    const allBlogs = await Blog.find({})
    return allBlogs.map(b => b.toJSON())
}

const getAllUsersInDB = async () => {
    const allUsers = await User.find({})
    return allUsers.map(u => u.toJSON())
}

module.exports = {getAllBlogsInDB, getAllUsersInDB}