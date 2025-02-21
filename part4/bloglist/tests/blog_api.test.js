const {test, describe, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const {initialBlogs} = require("../utils/list_helper")
const app = require("../app")
const middlewares = require('../utils/middleware')
const Blog = require("../models/blog")
const User = require('../models/user')
const {getAllBlogsInDB, getAllUsersInDB} = require('./test_helpers')

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

test('returns correct number of blogs', async () => {
    const allBlogs = await getAllBlogs()
    assert.strictEqual(initialBlogs.length, allBlogs.body.length)
})

test('_id is indeed id', async () => {
    const allBlogs = await getAllBlogs()
    const _id = allBlogs.body[0]._id
    const id = allBlogs.body[0].id
    assert(!_id && id)

})
test('we can actually add a blog', async () => {
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
    test('we can\'t add blogs without an url', async () => {
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
    test('we can\'t add blogs without a title', async () => {
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
test('likes are 0 if empty', async () => {
    const newBlog = await api.post('/api/blogs').send({title: 'A Bob\'s Life', author: 'Bob', url: 'www.boblogsblogsblogbob.bob'}).expect(201).expect('Content-type', /application\/json/)
    assert.strictEqual(newBlog.body.likes, 0)
})

describe('deletions', () => {
    test('we can delete existing blog', async () => {
        const allBlogs = await getAllBlogsInDB()
        const firstBlog = allBlogs[0]
        await api.delete(`/api/blogs/${firstBlog.id}`).expect(204)
        const newBlogs = await getAllBlogsInDB()
        assert.strictEqual(newBlogs.find(b => b.id === firstBlog.id), undefined)
        assert.strictEqual(allBlogs.length -1, newBlogs.length)
    })
    test('we get error 400 and no deletion from wrong id format', async () =>{
        const allBlogs = await getAllBlogsInDB()
        await api.delete('/api/blogs/68').expect(400)
        const newBlogs = await getAllBlogsInDB()
        assert.deepStrictEqual(allBlogs, newBlogs)
    } )
    test('we get error 404 and no deletion from non existing blog', async () =>{
        const allBlogs = await getAllBlogsInDB()
        await api.delete('/api/blogs/5a422b3a1b54a676234d17f4').expect(404)
        const newBlogs = await getAllBlogsInDB()
        assert.deepStrictEqual(allBlogs, newBlogs)
    } )
})

describe('editing blogs', () =>
{
    test('an existing blog can be replaced', async () => {
        const allBlogs = await getAllBlogsInDB()
        const firstBlog = allBlogs[0]
        const newBlog = {
            author: 'Bob Log',
            title: 'Bob\'s Log Blogs',
            url: 'http://boblogsblogsblog.ogg'
        }
        await api.put(`/api/blogs/${firstBlog.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-type', /application\/json/)
        const updatedBlog = await Blog.findById(firstBlog.id)
        assert.strictEqual(updatedBlog.title, newBlog.title)
    })

    test('likes can be edited independently', async () => {
        const allBlogs = await getAllBlogsInDB()
        const firstBlog = allBlogs[0]
        await api.put(`/api/blogs/${firstBlog.id}`)
            .send({likes: 50})
            .expect(200)
            .expect('Content-type', /application\/json/)
        const updatedBlog = await Blog.findById(firstBlog.id)
        assert.strictEqual(updatedBlog.likes, 50)
        assert.strictEqual(updatedBlog.title, firstBlog.title)
    })
})
const validUser = {
    username: 'kevapaereo',
    name: 'Álvaro Moreno',
    password: 'passme'
}
describe.only('adding users', () => {
    beforeEach( async () =>
    {
        await User.deleteMany({})
    })

    test('can add a valid new user', async () => {
        const allUsersBefore = await getAllUsersInDB()
        await api
            .post('/api/users')
            .send(validUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const allUsersAfter = await getAllUsersInDB()
        assert.strictEqual(allUsersBefore.length + 1, allUsersAfter.length)
        assert(allUsersAfter.find(u => u.username === validUser.username))
    })

    test('can\'t add a valid user twice', async () =>{
        await api
            .post('/api/users')
            .send(validUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const allUsersBefore = await getAllUsersInDB()
        const res = await api.post('/api/users')
            .send(validUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const allUsersAfter = await getAllUsersInDB()
        assert.strictEqual(allUsersBefore.length, allUsersAfter.length)
        assert.strictEqual(res.body.error, 'User already exists')
    })

    test('can\'t add if missing username', async () => {
        const user = {...validUser, username: ''}
        const res = await api.post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
        const usersAfter = await getAllUsersInDB()
        assert.strictEqual(usersAfter.length, 0)
        assert.strictEqual(res.body.error, 'Path `username` is required.')
    })

    test('can\'t add if username is too short', async () => {
        const user = {...validUser, username:'ah'}
        const res = await api.post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
        const allUsersAfter = await getAllUsersInDB()
        assert.strictEqual(allUsersAfter.length, 0)
        assert(res.body.error.includes('is shorter than the minimum allowed length (3)'))
    })

    test('can\'t add if password is too short', async () => {
        const user = {...validUser, password: 'uh'}
        const res = await api.post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
        const allUsersAfter = await getAllUsersInDB()
        assert.strictEqual(allUsersAfter.length, 0)
        assert.strictEqual(res.body.error, 'Password must be at least 3 characters long')
    })
})

after( async () => await mongoose.connection.close())