import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notification, setNotification] = useState({message:'', error:true})

    const showError = (message) => sendNotification(message, true)
    const showNotification = (message) => sendNotification(message, false)


    const sendNotification = (message, error = true) => {
        if(!message)
        {
            return
        }
        setNotification({message, error})
        setTimeout(() => {
            setNotification({message:'', error:true})
        }, 5000)
    }

    useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

    const doLogin = (event) => {
        event.preventDefault()
        if (!username || !password)
        {
            showError('Ooops')
        }
    }

  const loginForm = () => (
      <>
        <h2>Login to application</h2>
          <form>
              <div>
                  Username
                  <input
                      onChange={(evt)=> setUsername(evt.target.value)}
                      type="text"
                      name="Username"
                      value={username}
                  />
              </div>
              <div>
                  Password
                  <input
                      onChange={(evt) => setPassword(evt.target.value)}
                      type="password"
                      name="Password"
                      value={password}
                  />
              </div>
              <button type="submit" onClick={doLogin}>Login</button>
          </form>
      </>
  )

  const drawBlogs = () => (
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog}/>
        )}
      </div>
  )

  return (
      <>
          <Notification message={notification?.message} error={notification?.error} />

          {user?drawBlogs():loginForm()}
      </>
  )
}

export default App