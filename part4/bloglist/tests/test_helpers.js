const Blog = require('../models/blog')

const getAllBlogsInDB = async () => {
    const allBlogs = await Blog.find({})
    return allBlogs.map(b => b.toJSON())
}

module.exports = {getAllBlogsInDB}