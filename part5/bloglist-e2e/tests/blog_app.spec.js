const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./blog_app.helper')
const URL = 'http://localhost:5173'
const API = `${URL}/api`

describe('Blog App', () => {
    beforeEach( async ({ page }) => {
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
            await helper.login(page)
            await helper.checkNotification(page, `Welcome back, ${helper.validUser.name}!`)
        })
        test('fails with wrong credentials', async ({page}) => {
            await helper.login(page, true)
            await helper.checkNotification(page, 'Invalid user or password', true)
        })
    })
})
