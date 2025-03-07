import Blog from './Blog.jsx'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<Blog /> component', () => {

    const blog = {
        title: 'Bob Log Blog',
        author: 'Bob',
        url: 'https://boblog.com',
        likes: 0,
        user: {
            username: 'Willy'
        }
    }
    const activeUser = {
        username: 'Bob'
    }
    let currentContainer
    let toggleableContainer

    const hiddenStyle = 'display: none'
    const fillerMock = vi.fn()

    beforeEach( () => {
        const { container } = render(<Blog
            activeUser={activeUser}
            deleteBlog={fillerMock}
            showNotification={fillerMock}
            orderBlogs={fillerMock}
            blog={blog}
        />)
        currentContainer = container
        toggleableContainer = currentContainer.querySelector('.toggleable-content')

    })

    test('displays title and author, but not url and likes', () => {
        const title = screen.getByText(blog.title)
        const author = screen.getByText(`by ${blog.author}`)
        const url = screen.getByText(blog.url, {exact: false})
        const likes = screen.getByText('Likes:')
        expect(title).toBeVisible()
        expect(author).toBeVisible()
        expect(url).not.toBeVisible()
        expect(likes).not.toBeVisible()
        expect(toggleableContainer).toHaveStyle(hiddenStyle)
    })
    test('url and likes become visible after click', async () => {
        const url = screen.getByText(blog.url, {exact: false})
        const likes = screen.getByText('Likes:')
        const user = userEvent.setup()
        const button = screen.getByText('Show details')
        await user.click(button)
        expect(url).toBeVisible()
        expect(likes).toBeVisible()
        expect(toggleableContainer).not.toHaveStyle(hiddenStyle)
    })
})