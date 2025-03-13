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

const checkNotification = async (page, text, error = false) => {
    const notification = await page.locator('.notification').getByText(text)
    await expect(notification).toBeVisible()
    if (error)
    {
        await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')
    }
}

const login = async (page, checkFail = false) => {
    const userData = checkFail?invalidUser:validUser
    await page.getByTestId('username').fill(userData.username)
    await page.getByTestId('password').fill(userData.password)
    await page.getByRole('button', {name: 'Login' }).click()
    await page.locator('.notification').waitFor()
}

module.exports = { validUser, checkNotification, login }