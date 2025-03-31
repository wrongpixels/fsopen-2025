import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog.jsx'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm.jsx'
import Toggleable from './components/Toggleable.jsx'
import blogService from './services/blogs'

const USER_KEY = 'activeUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: '',
    error: true,
  })
  const newBlogRef = useRef()
  const loginFormRef = useRef()

  const showError = (message) => sendNotification(message, true)
  const showNotification = (message) => sendNotification(message, false)

  const sendNotification = (message, error = true) => {
    if (!message) {
      return
    }
    setNotification({ message, error })
    setTimeout(() => {
      setNotification({ message: '', error: true })
    }, 5000)
  }

  useEffect(() => {
    if (!user) {
      const existingSession = window.localStorage.getItem(USER_KEY)
      if (existingSession) {
        const validUser = JSON.parse(existingSession)
        if (validUser && validUser.token) {
          setUser(validUser)
        } else {
          window.localStorage.removeItem(USER_KEY)
        }
      }
    }
  }, [])
  useEffect(() => {
    if (user) {
      getAllBlogs()
      blogService.buildToken(user.token)
    } else {
      blogService.buildToken('')
    }
  }, [user])

  const addNewBlog = async (title, author, url) => {
    const newBlog = await blogService.addBlog(title, author, url)
    if (newBlog && newBlog.title === title) {
      setBlogs(blogs.concat(newBlog))
      newBlogRef.current?.toggleVisibility()
      showNotification(
        `'${title}' by ${author} was added to the Blog List!`,
        false,
      )
    } else if (newBlog.error) {
      showNotification(newBlog.error)
    } else {
      showNotification('There was an error adding the entry')
    }
    return newBlog
  }

  const deleteBlog = (id) => orderBlogs(blogs.filter((b) => b.id !== id))

  const addLike = async (blog) => {
    const editedBlog = await blogService.replaceBlogData(
      { likes: blog.likes + 1 },
      blog.id,
      showNotification,
    )
    if (editedBlog) {
      showNotification('Blog was liked!')
      replaceBlog(editedBlog)
    }
  }
  const replaceBlog = (editedBlog) => {
    const updatedBlogs = blogs.map((b) =>
      b.id === editedBlog.id ? editedBlog : b,
    )
    orderBlogs(updatedBlogs)
  }

  const getAllBlogs = async () => {
    const allBlogs = await blogService.getAll()
    orderBlogs(allBlogs)
  }
  const orderBlogs = (targetBlogs = blogs) => {
    if (!targetBlogs) {
      return
    }
    setBlogs([...targetBlogs].sort((a, b) => b.likes - a.likes))
  }
  const setSession = (userData) => {
    setUser(userData)
    showNotification(`Welcome back, ${userData.name}!`)
    window.localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }
  const doLogOut = () => {
    showNotification(`See you soon, ${user.name}!`)
    setUser(null)
    window.localStorage.removeItem(USER_KEY)
    loginFormRef.current?.cleanForm()
  }
  const loginForm = () => (
    <>
      <LoginForm
        showError={showError}
        setSession={setSession}
        ref={loginFormRef}
      />
    </>
  )

  const drawBlogs = () => (
    <div className="blog-list">
      <h2>Blogs</h2>
      <p>
        Logged in as <b> {user.username} </b>
        <button onClick={doLogOut}>Log out</button>
      </p>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          showNotification={sendNotification}
          likeBlog={addLike}
          activeUser={user}
          deleteBlog={deleteBlog}
        />
      ))}
      <div>
        <Toggleable
          ref={newBlogRef}
          labelOnVisible={'Hide new Blog Form'}
          labelOnInvisible={'Add a new Blog'}
          initialVisibility={false}
          addSpace={false}
          showOver={true}
        >
          <NewBlog
            showNotification={sendNotification}
            addNewBlog={addNewBlog}
          />
        </Toggleable>
      </div>
    </div>
  )

  return (
    <>
      <Notification notification={notification} />
      {user ? drawBlogs() : loginForm()}
    </>
  )
}

export default App
