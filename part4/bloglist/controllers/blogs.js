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

router.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

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

router.delete('/:id', async (request, response) => {
    const id = request.params.id

        const blog = await Blog.findByIdAndDelete(id)
        if (blog)
        {
            return response.status(204).end()
        }
        return response.status(404).json({Error: 'Entry doesn\'t exist in server'})
})

router.put('/:id', async (request, response) => {
    const id = request.params.id
    const updatedInfo = request.body
    if (!updatedInfo)
    {
        return response.status(400).json({Error: 'Updated data can\'t be empty'})
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, {new: true, runValidators: true, context: 'query'})
    if (updatedBlog)
    {
        return response.status(200).json(updatedBlog)
    }
    response.status(404).json({Error: `Blog to update was not found.`})
})


module.exports = router;