const { expect } = require('@playwright/test')

const validUser = {
    username: 'bestUser',
    name: 'Pepe Pérez',
    password: 'supersafe'
}
const invalidUser = {
    username: 'bestestUser',
    name: 'Pepe Pérez',
    password: 'supersafe'
}

const validBlog = {
    title: "Bob Log's Log Blog",
    author: "Bob B. Log",
    url: 'http://bobloglogblob.blog'
}

let page

const setPage = (_page) => page = _page

const checkNotification = async (text, error = false) => {
    const notification = await page.locator('.notification', {hasText: text })
    await expect(notification).toBeVisible()

    if (error)
    {
        await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')
    }
}

const login = async (checkFail = false) => {
    const userData = checkFail?invalidUser:validUser
    await page.getByTestId('username').fill(userData.username)
    await page.getByTestId('password').fill(userData.password)
    await page.getByRole('button', {name: 'Login' }).click()
    await page.locator('.notification').waitFor()
}

const showNewBlogEntry = async() =>{
    const newBlogButtons = await page.getByRole('button', { name: 'Add a new Blog'}).all()
    if (newBlogButtons.length > 0)
    {
        await newBlogButtons[0].click()
        await page.getByRole('button', { name: 'Hide new Blog'}).waitFor()
    }
}

const createBlog = async (blogData = null) => {
    if (!blogData)
    {
        blogData = validBlog
    }
    await showNewBlogEntry()
    await page.getByTestId('blog-title').fill(blogData.title)
    await page.getByTestId('blog-author').fill(blogData.author)
    await page.getByTestId('blog-url').fill(blogData.url)
    await page.getByRole('button', { name: 'Add entry'}).click()
}

module.exports = { setPage, validUser, validBlog, checkNotification, login, createBlog }