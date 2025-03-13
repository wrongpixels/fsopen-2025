const { expect } = require('@playwright/test')

const validUser = {
    username: 'bestUser',
    name: 'Pepe Pérez',
    password: 'supersafe'
}
const anotherValidUser = {
    username: 'bestUser2',
    name: 'Pepe Pérezdos',
    password: 'supersafedos'
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
const anotherValidBlog = {
    title: "Bob Log's Log Blog - EXTREME",
    author: "Bob B. Log",
    url: 'http://bobloglogblobextreme.blog'
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

const login = async (checkFail = false,  userData = null) => {
    if (!userData)
    {
        userData = checkFail?invalidUser:validUser
    }
    await page.getByTestId('username').fill(userData.username)
    await page.getByTestId('password').fill(userData.password)
    await page.getByRole('button', {name: 'Login' }).click()
    if (!checkFail)
    {
        await page.getByText('Logged in as').waitFor()
    }

}

const showNewBlogEntry = async() =>{
    const newBlogButtons = await page.getByRole('button', { name: 'Add a new Blog'}).all()
    if (newBlogButtons.length > 0)
    {
        await newBlogButtons[0].click()
        await page.getByRole('button', { name: 'Hide new Blog'}).waitFor()
    }
}

const getBlog = async (blogTitle = null) => {
    if (!blogTitle)
    {
        blogTitle = validBlog.title
    }
   return await page.locator('.blog-list').getByText(blogTitle)
}

const getBlogParent = async (blogTitle = null) => {
    if (!blogTitle) {
        blogTitle = validBlog.title
    }
    const blog = await getBlog(blogTitle)
    if (blog)
    {
        return await blog.locator('..')
    }
}

const getButtonInBlog = async (blogTitle, buttonName) => {
    if (!blogTitle)
    {
        blogTitle = validBlog.title
    }
    const blog = await getBlog(blogTitle)
    const blogParent = await blog.locator('..')
    const buttons = await blogParent.getByRole('button', { name: buttonName}).all()
    if (buttons.length > 0)
    {
        return buttons[0]
    }
    return null
}

const clickButtonInBlog = async (blogTitle = null, buttonName) => {
    if (!blogTitle)
    {
        blogTitle = validBlog.title
    }
    const button = await getButtonInBlog(blogTitle, buttonName)
    if (button)
    {
        await button.click()
        return button
    }
}

const expandOrCollapse = async (blog = null) =>{
    if (!blog)
    {
        blog = validBlog
    }
    const expandButton = await clickButtonInBlog(blog.title, 'Show details')
    if (!expandButton)
    {
        await clickButtonInBlog(blog.title, 'Hide details')
    }
}

const createBlog = async (blogData = null, waitFor = true) => {
    if (!blogData)
    {
        blogData = validBlog
    }
    await showNewBlogEntry()
    await page.getByTestId('blog-title').fill(blogData.title)
    await page.getByTestId('blog-author').fill(blogData.author)
    await page.getByTestId('blog-url').fill(blogData.url)
    await page.getByRole('button', { name: 'Add entry'}).click()
    await page.locator('.blog-list').getByText(blogData.title).waitFor()

}

module.exports = {
    setPage,
    validUser,
    anotherValidUser,
    validBlog,
    anotherValidBlog,
    checkNotification,
    login,
    createBlog,
    getBlog,
    getBlogParent,
    expandOrCollapse,
    getButtonInBlog,
    clickButtonInBlog
}