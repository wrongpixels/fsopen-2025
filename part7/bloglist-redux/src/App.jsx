import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import NewBlog from "./components/NewBlog.jsx";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm.jsx";
import Toggleable from "./components/Toggleable.jsx";
import blogService from "./services/blogs";
import { useDispatch, useSelector } from "react-redux";
import { createAlert } from "./reducers/notificationReducer.js";
import { getAllBlogs, createBlog } from "./reducers/blogsReducer.js";

const USER_KEY = "activeUser";

const App = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((s) => s);

  const [user, setUser] = useState(null);

  const newBlogRef = useRef();
  const loginFormRef = useRef();

  const showError = (message) => sendNotification(message, true);
  const showNotification = (message) => sendNotification(message, false);

  const sendNotification = (message, error = true) => {
    if (!message) {
      return;
    }
    dispatch(createAlert(message, error));
  };

  useEffect(() => {
    if (!user) {
      const existingSession = window.localStorage.getItem(USER_KEY);
      if (existingSession) {
        const validUser = JSON.parse(existingSession);
        if (validUser && validUser.token) {
          setUser(validUser);
        } else {
          window.localStorage.removeItem(USER_KEY);
        }
      }
    }
  }, []);
  useEffect(() => {
    if (user) {
      dispatch(getAllBlogs());
      blogService.buildToken(user.token);
    } else {
      blogService.buildToken("");
    }
  }, [user]);

  const addNewBlog = async (title, author, url) => {
    dispatch(createBlog({ title, author, url }));
  };

  const deleteBlog = (id) => null;

  const addLike = (blog) => null;

  const setSession = (userData) => {
    setUser(userData);
    showNotification(`Welcome back, ${userData.name}!`);
    window.localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };
  const doLogOut = () => {
    showNotification(`See you soon, ${user.name}!`);
    setUser(null);
    window.localStorage.removeItem(USER_KEY);
    loginFormRef.current?.cleanForm();
  };
  const loginForm = () => (
    <>
      <LoginForm
        showError={showError}
        setSession={setSession}
        ref={loginFormRef}
      />
    </>
  );

  const drawBlogs = () => {
    console.log(blogs);
    if (!blogs) {
      return <h2>Loading…</h2>;
    }
    return (
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
            labelOnVisible={"Hide new Blog Form"}
            labelOnInvisible={"Add a new Blog"}
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
    );
  };
  return (
    <>
      <Notification />
      {user ? drawBlogs() : loginForm()}
    </>
  );
};

export default App;
