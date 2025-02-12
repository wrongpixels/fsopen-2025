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

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

router.post('/', async (request, response) => {

        const blog = new Blog(request.body)
        const existing = await alreadyExists(blog);
        if (existing.blog) {
            return response.status(400).json({
                Error: `Blog already exists with same ${existing.match}`
            });
        }
        const savedBlog = await blog.save();

        response.status(201).json(savedBlog);
    }
)

module.exports = router;