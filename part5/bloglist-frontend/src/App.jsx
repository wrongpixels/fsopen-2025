import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login.js'

const USER_KEY = 'activeUser'

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
        if (!user)
        {
            const existingSession = window.localStorage.getItem(USER_KEY)
            if (existingSession)
            {
                const validUser = JSON.parse(existingSession)
                if (validUser && validUser.token)
                {
                    setUser(validUser)
                }
                else
                {
                    window.localStorage.removeItem(USER_KEY)
                }
            }
        }
    }, []);
    useEffect(() => {
        if (user) {
            getAllBlogs()
        }
  }, [user])

    const getAllBlogs = async () => {
        const allBlogs = await blogService.getAll()
        if (allBlogs)
        {
            setBlogs(allBlogs)
        }
    }

    const doLogOut = (event) => {
        showNotification(`See you soon, ${user.username}!`)
        setUser(null)
        window.localStorage.removeItem(USER_KEY)
        setPassword('')
        setUsername('')
    }

    const doLogin = async (event) => {
        event.preventDefault()
        if (!username || !password)
        {
            showError('Username and password can\'t be empty.')
            return
        }
        const userData = await loginService.tryLogin(username, password)
        if (userData === null)
        {
            showError('Login failed.')
            return
        }
        if (userData.error)
        {
            showError(userData.error)
            return
        }
        if (!userData.token)
        {
            showError('Token is not valid.')
            return
        }
        setUser(userData)
        showNotification(`Welcome back, ${userData.username}!`)
        window.localStorage.setItem(USER_KEY, JSON.stringify(userData))
    }

  const loginForm = () => (
      <>
        <h2>Login to application</h2>
          <form>
              <div>
                  Username
                  <input
                      onChange={({target})=> setUsername(target.value)}
                      type="text"
                      name="Username"
                      value={username}
                  />
              </div>
              <div>
                  Password
                  <input
                      onChange={({target}) => setPassword(target.value)}
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
          <h2>Blogs</h2>
          <p>
              Logged in as <b> {user.username} </b><button onClick={doLogOut}>Log out</button>
          </p>
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