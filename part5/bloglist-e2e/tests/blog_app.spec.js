const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./blog_app.helper')
const URL = 'http://localhost:5173'
const API = `${URL}/api`

describe('Blog App', () => {
    beforeEach( async ({ page }) => {
        helper.setPage(page)
        await page.request.post(`${API}/testing/reset`)
        await page.request.post(`${API}/users`, { data: helper.validUser })

        //Firefox fails if we don't add a wait here
        await page.waitForTimeout(100)
        await page.goto(URL)
    })

    test('login form is shown by default', async ({page}) => {
    await expect(page.getByText('Login to application')).toBeVisible()
    })

    describe('Login', () => {

        test('succeeds with correct credentials', async ({page}) => {
            await helper.login()
            await helper.checkNotification(`Welcome back, ${helper.validUser.name}!`)
        })
        test('fails with wrong credentials', async ({page}) => {
            await helper.login(true)
            await helper.checkNotification('Invalid user or password', true)
        })
    })
    describe('When logged in', () => {
        beforeEach(async () => {
            await helper.login()
        })
        test('a new blog can be created', async({page}) => {
            await helper.createBlog()
            await expect(page.locator('.blog-list').getByText(helper.validBlog.title)).toBeVisible()
        })
        test('a blog can be liked', async ({page}) => {
            await helper.createBlog()
            await helper.expandOrCollapse(helper.validBlog.title)
            const blogParent = await helper.getBlogParent(helper.validBlog.title)
            const likesField = await blogParent.locator('.blog-likes')
            const likes = parseInt(await likesField.textContent())
            await helper.clickButtonInBlog(helper.validBlog.title, 'Like!')
            await expect(blogParent.getByText(likes + 1)).toBeVisible()
        })
    })
})
