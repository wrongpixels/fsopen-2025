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
            await expect(page.getByText(`Logged in as`)).toBeVisible()
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
        test('a blog can be liked', async () => {
            await helper.createBlog()
            await helper.expandOrCollapse(helper.validBlog.title)
            const blogParent = await helper.getBlogParent(helper.validBlog.title)
            const likesField = await blogParent.locator('.blog-likes')
            const likes = parseInt(await likesField.textContent())
            await helper.clickButtonInBlog(helper.validBlog.title, 'Like!')
            await expect(blogParent.getByText(likes + 1)).toBeVisible()
        })
        test('a blog can be deleted by the creator', async ({page}) => {
            await helper.createBlog()
            await helper.expandOrCollapse()
            page.on('dialog', d => d.accept())
            await helper.clickButtonInBlog('Remove')
            const blog = await helper.getBlog()
            await expect(blog).not.toBeVisible()
        })
        test('a blog cannot be deleted by another user', async ({page}) =>{
            await helper.createBlog()
            await page.request.post(`${API}/users`, {data: helper.anotherValidUser})
            //Firefox fails if we don't add a wait here
            await page.waitForTimeout(100)
            await page.getByRole('button', { name: 'Log out'}).click()
            await helper.login(false, helper.anotherValidUser)
            await helper.expandOrCollapse()
            const removeButton = await helper.getButtonInBlog(helper.validBlog.title, 'Remove')
            await expect(removeButton).toBeNull()

        })
    })
})
