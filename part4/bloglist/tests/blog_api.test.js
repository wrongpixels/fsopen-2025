const {test, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const {initialBlogs} = require("./test_helpers")
const app = require("../app")
const Blog = require("../models/blog")

const api = supertest(app)

beforeEach( async () => {
    await Blog.deleteMany({})
    for (const b of initialBlogs)
    {
        const newBlog = new Blog(b)
        await newBlog.save()
    }
})

test.only('returns correct number of blogs', async () => {
    const allBlogs = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-type', /application\/json/)
    assert.strictEqual(initialBlogs.length, allBlogs.body.length)
})

after( () => mongoose.disconnect())