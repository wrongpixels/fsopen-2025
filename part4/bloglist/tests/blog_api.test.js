const {test, describe, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const {initialBlogs} = require("../utils/list_helper")
const app = require("../app")
const Blog = require("../models/blog")
const {getAllBlogsInDB} = require('./test_helpers')

const api = supertest(app)

beforeEach( async () => {
    await Blog.deleteMany({})
    for (const b of initialBlogs)
    {
        const newBlog = new Blog(b)
        await newBlog.save()
    }
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
test.only('we can actually add a blog', async () => {
    const originalLength = initialBlogs.length
    const newBlog = {
        title: 'Bob Log\'s Blogs Blog',
        author: 'Bob Log',
        url: 'http://boblogsblogsblog.ogg'
    }
    await api.post('/api/blogs').send(newBlog).expect(201)
    const newBlogs = await getAllBlogsInDB()
    const addedBlog = newBlogs.find(b => b.title === newBlog.title)
    assert.strictEqual(originalLength + 1, newBlogs.length)
    assert(addedBlog)
})
describe('can\'t add', () =>
{
    test.only('we can\'t add blogs without an url', async () => {
        const originalLength = initialBlogs.length
        const newBlog = {
            title: 'Bob Log\'s Blogs Blog',
            author: 'Bob Log',
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
        const newBlogs = await getAllBlogsInDB()
        const addedBlog = newBlogs.find(b => b.title === newBlog.title)
        assert.strictEqual(originalLength, newBlogs.length)
        assert(!addedBlog)
    })
    test.only('we can\'t add blogs without a title', async () => {
        const originalLength = initialBlogs.length
        const newBlog = {
            author: 'Bob Log',
            url: 'http://boblogsblogsblog.ogg'
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
        const newBlogs = await getAllBlogsInDB()
        const addedBlog = newBlogs.find(b => b.url === newBlog.url)
        assert.strictEqual(originalLength, newBlogs.length)
        assert(!addedBlog)
    })
}
)
test.only('likes are 0 if empty', async () => {
    const newBlog = await api.post('/api/blogs').send({title: 'A Bob\'s Life', author: 'Bob', url: 'www.boblogsblogsblogbob.bob'}).expect(201).expect('Content-type', /application\/json/)
    assert.strictEqual(newBlog.body.likes, 0)
})
after( async () => await mongoose.connection.close())