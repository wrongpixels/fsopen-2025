const router = require("express").Router();
const Blog = require("../models/blog");
const {log, error} = require("../utils/logger")

const alreadyExists = async (blog) => {
    const existing = {
        blog: null,
        match: ""
    }
    if (!blog) {
        return existing
    }
    try {

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

    } catch (error) {
        throw error
    }
    return existing;
};

router.get('/', (request, response, next) => {
    log("running");
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        }).catch(error => next(error))
})

router.post('/', async (request, response, next) => {
    try {

        const blog = new Blog(request.body)
        const existing = await alreadyExists(blog);

        if (existing.blog) {
            return response.status(400).json({
                Error: `Blog already exists with same ${existing.match}`
            });
        }
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        next(error);
    }
})

module.exports = router;