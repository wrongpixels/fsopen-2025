const { test, expect, beforeEach, describe } = require('@playwright/test')

const URL = 'http://localhost:5173'


describe('Blog App', () => {
    beforeEach( async ({ page }) => {
        await page.goto(URL)
    })

    test('login form is shown by default', async ({page}) => {
    await expect(page.getByText('Login to application')).toBeVisible()
    })
})
