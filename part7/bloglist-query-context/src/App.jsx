import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog.jsx'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm.jsx'
import Toggleable from './components/Toggleable.jsx'
import blogService from './services/blogs'
import { useNotificationDispatch } from './context/NotificationContext.jsx'
import { showAlert } from './actions/notificationActions.js'
import {
  useGetBlogs,
  useCreateBlog,
  useDeleteBlog,
  useReplaceBlog,
} from './queries/blogQueries.js'

const USER_KEY = 'activeUser'

const App = () => {
  const dispatchAlert = useNotificationDispatch()
  const createBlogMutation = useCreateBlog()
  const replaceBlogMutation = useReplaceBlog()
  const deleteBlogMutation = useDeleteBlog()
  const [user, setUser] = useState(null)

  const newBlogRef = useRef()
  const loginFormRef = useRef()

  const showError = (message) => sendNotification(message, true)
  const showNotification = (message) => sendNotification(message, false)

  const sendNotification = (message, error = true) => {
    if (!message) {
      return
    }
    showAlert(dispatchAlert, message, error)
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
      blogService.buildToken(user.token)
    } else {
      blogService.buildToken('')
    }
  }, [user])

  const { isLoading, isError, data } = useGetBlogs()

  if (isLoading) {
    return <h2>Loading app…</h2>
  }
  if (isError) {
    return (
      <h2>
        Server not available! <p>Please, try later.</p>
      </h2>
    )
  }
  const blogs = data
  const addNewBlog = (blog) => {
    createBlogMutation.mutate(blog, {
      onSuccess: (newBlog) => {
        showNotification(
          `'${newBlog.title}' by ${newBlog.author} was added to the Blog List!`,
        )
        newBlogRef.current?.toggleVisibility()
        return newBlog
      },
      onError: (e) => {
        if (e.response?.data?.error) {
          showError(e.response.data.error)
        } else {
          showError('There was an error adding the entry')
        }
      },
    })
  }
  const deleteBlog = (blog) => {
    deleteBlogMutation.mutate(blog, {
      onSuccess: () => showNotification(`Blog '${blog.title}' was deleted!`),
      onError: () => showError('There was an error deleting the blog'),
    })
  }

  const addLike = (blog) => {
    replaceBlogMutation.mutate(
      { id: blog.id, likes: blog.likes + 1 },
      {
        onSuccess: () => showNotification(`Blog '${blog.title}' was liked!`),
        onError: () => showError('There was an error adding the like'),
      },
    )
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
      <Notification />
      {user ? drawBlogs() : loginForm()}
    </>
  )
}

export default App
