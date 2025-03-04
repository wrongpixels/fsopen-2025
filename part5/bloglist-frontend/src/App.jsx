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

    const [notification, setNotification] = useState({message:'', error:true})
    const newBlogRef = useRef()
    const loginFormRef = useRef()

    const showError = (message) => sendNotification(message, true)
    const showNotification = (message) => sendNotification(message, false)


    const sendNotification = (message, error = true) => {
        if(!message)
        {
            return
        }
        setNotification({message, error})
        setTimeout(() => {
                setNotification({message: '', error: true})

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
            blogService.buildToken(user.token)
        }
        else
        {
            blogService.buildToken('')
        }

  }, [user])

    const getAllBlogs = async () => {
        const allBlogs = await blogService.getAll()
        if (allBlogs)
        {
            setBlogs(allBlogs)
        }
    }
    const setSession = (userData) => {
        setUser(userData)
        showNotification(`Welcome back, ${userData.username}!`)
        window.localStorage.setItem(USER_KEY, JSON.stringify(userData))
    }
    const doLogOut = () => {
        showNotification(`See you soon, ${user.username}!`)
        setUser(null)
        window.localStorage.removeItem(USER_KEY)
        loginFormRef.current?.cleanForm()
    }

    const loginForm = () => <><LoginForm
        showError={showError}
        setSession={setSession}
        ref={loginFormRef}
    /></>

  const drawBlogs = () => (
      <div>
          <h2>Blogs</h2>
          <p>
              Logged in as <b> {user.username} </b><button onClick={doLogOut}>Log out</button>
          </p>
          {blogs.map(blog =>
              <Blog key={blog.id} blog={blog}/>
          )}
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
             getAllBlogs={getAllBlogs}
         />
          </Toggleable></div>
      </div>
  )

    return (
      <>
          <Notification notification={notification} />
          {user?drawBlogs():loginForm()}
      </>
  )
}

export default App