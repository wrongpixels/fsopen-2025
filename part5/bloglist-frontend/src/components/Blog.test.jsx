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
    })

    test('displays title and author, but not url and like', async () => {
        const title = screen.getByText(blog.title)
        const author = screen.getByText(`by ${blog.author}`)
        const url = screen.getByText(blog.url, {exact: false})
        const likes = screen.getByText(`Likes:`)
        const expandedContainer = currentContainer.querySelector('.toggleable-content')
        expect(currentContainer).not.toHaveStyle(hiddenStyle)
        expect(expandedContainer).toHaveStyle(hiddenStyle)
    })
})