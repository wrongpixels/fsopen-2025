const router = require("express").Router()
const Blog = require("../models/blog")
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {log, error} = require("../utils/logger")

const alreadyExists = async (blog) => {
    const existing = {
        blog: null,
        match: ""
    }
    if (!blog) {
        return existing
    }
        existing.blog = await Blog.findOne({title: blog.title});
        if (existing.blog) {
            existing.match = 'title';
            return existing;
        }
        existing.blog = await Blog.findOne({url: blog.url})
        if (existing.blog) {
            existing.match = 'url';
            return existing;
        }
    return existing;
};

router.get('/injectUsers', async (req, res) => {
    const allUsers = await User.find({})
    for (const user of allUsers)
    {
        user.blogs = []
        await user.save()
    }
    let userIndex = 0
    const allBlogs = await Blog.find({})
    for (const blog of allBlogs) {
        const user = allUsers[allUsers.length-1-userIndex]
        blog.user = user._id
        userIndex += 1
        if (userIndex >= allUsers.length) {
            userIndex = 0
        }
        await blog.save()
        user.blogs = user.blogs.concat(blog._id)
        await user.save()

    }
    res.status(200).json({ message: 'Users injected successfully' })
})
router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {blogs: 0});
    response.json(blogs);
});

router.get('/:id', async (request, response) => {
    const id = response.params.id

        const blog = await Blog.findById(id)
        if (blog)
        {
            return response.json(blog)
        }
        else
        {
            return response.status(404).end()
        }
})

const extractToken = (req) => {
    const auth = req.get('authorization')
    if (auth)
    {
        if (auth.startsWith('Bearer '))
        {
            return auth.replace('Bearer ', '')
        }
    }
    return null
}
router.post('/', async (request, response) => {
        if (!request.body)
        {
            return response.status(400).json({error: 'Missing blog data'})
        }
        const token = extractToken(request)
        if (!token)
        {
            return response.status(401).json({error: 'User session is not valid'})
        }
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken || !decodedToken.id)
        {
            return response.status(401).json({error: 'Token was invalid'})
        }
        const user = await User.findById(decodedToken.id)
        if (!user)
        {
            return response.status(401).json({error: 'User is not in database'})
        }
        const blogToAd = request.body
        blogToAd.user = user._id
        const blog = new Blog(blogToAd)
        const existing = await alreadyExists(blog);
        if (existing.blog) {
            return response.status(400).json({
                error: `Blog already exists with same ${existing.match}`
            });
        }
        const savedBlog = await blog.save();
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog);
    }
)

router.delete('/:id', async (request, response) => {
    const id = request.params.id

        const blog = await Blog.findByIdAndDelete(id)
        if (blog)
        {
            return response.status(204).end()
        }
        return response.status(404).json({error: 'Entry doesn\'t exist in server'})
})

router.put('/:id', async (request, response) => {
    const id = request.params.id
    const updatedInfo = request.body
    if (!updatedInfo)
    {
        return response.status(400).json({error: 'Updated data can\'t be empty'})
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, {new: true, runValidators: true, context: 'query'})
    if (updatedBlog)
    {
        return response.status(200).json(updatedBlog)
    }
    response.status(404).json({error: `Blog to update was not found.`})
})


module.exports = router;