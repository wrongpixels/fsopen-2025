import { useEffect, useRef } from "react";
import Blog from "./components/Blog";
import NewBlog from "./components/NewBlog.jsx";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm.jsx";
import Toggleable from "./components/Toggleable.jsx";
import { useDispatch, useSelector } from "react-redux";
import { createAlert } from "./reducers/notificationReducer.js";
import {
  getAllBlogs,
  createBlog,
  likeBlog,
  removeBlog,
} from "./reducers/blogsReducer.js";
import {
  login,
  logout,
  userLogin,
  userLogout,
} from "./reducers/userReducer.js";
const USER_KEY = "activeUser";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((s) => s.blogs);
  const user = useSelector((s) => s.user);

  const newBlogRef = useRef();
  const loginFormRef = useRef();

  const showError = (message) => sendNotification(message, true);

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
          dispatch(login(validUser));
        } else {
          dispatch(logout());
        }
      }
    }
  }, []);
  useEffect(() => {
    if (user?.token) {
      dispatch(getAllBlogs());
    }
  }, [user?.token]);

  const addNewBlog = async (title, author, url) => {
    const blogData = await dispatch(createBlog({ title, author, url }));
    if (blogData) {
      newBlogRef.current?.toggleVisibility();
      return blogData;
    }
  };

  const deleteBlog = (blog) => dispatch(removeBlog(blog));

  const addLike = (blog) => {
    if (!user) {
      showError("You need to be logged in to like a blog!");
    } else {
      dispatch(likeBlog(blog));
    }
  };

  const doLogin = async (username, password) => {
    await dispatch(userLogin(username, password));
    if (user) {
      loginFormRef.current?.cleanForm();
    }
  };

  const doLogOut = () => {
    dispatch(userLogout(user));
    loginFormRef.current?.cleanForm();
  };
  const loginForm = () => (
    <>
      <LoginForm showError={showError} doLogin={doLogin} ref={loginFormRef} />
    </>
  );

  const drawBlogs = () => {
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
  if (user && blogs === null) {
    return (
      <>
        <Notification />
        <h2>Loading…</h2>
      </>
    );
  }
  return (
    <>
      <Notification />
      {user ? drawBlogs() : loginForm()}
    </>
  );
};

export default App;
