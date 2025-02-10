const {test, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const {initialBlogs} = require("./test_helpers")
const app = require("../app")
const Blog = require("../models/blog")

const api = supertest(app)

beforeEach( async () => {
    console.time("beforeEachTime")
    await Blog.deleteMany({})
    for (const b of initialBlogs)
    {
        const newBlog = new Blog(b)
        await newBlog.save()
    }
    console.timeEnd("beforeEachTime")
})

const getAllBlogs = async () => await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/)

test.only('returns correct number of blogs', async () => {
    const allBlogs = await getAllBlogs()
    assert.strictEqual(initialBlogs.length, allBlogs.body.length)
})

test.only('_id is indeed id', async () => {
    const allBlogs = await getAllBlogs()
    const _id = allBlogs.body[0]._id
    const id = allBlogs.body[0].id
    assert(!_id && id)

})

after( async () => await mongoose.connection.close())