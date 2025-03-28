import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Blogs from "./components/Blogs.jsx";
import Blog from "./components/Blog.jsx";
import Notification from "./components/Notification";
import Users from "./components/Users";
import User from "./components/User.jsx";
import useActiveUser from "./hooks/useActiveUser.js";

const App = () => {
  const { activeUser: user } = useActiveUser();
  return (
    <>
      <Notification />
      <Router>
        {<Header user={user} />}
        <Routes>
          <Route path="/" element={<Blogs user={user} />} />
          <Route path="/users" element={<Users user={user} />} />
          <Route path="/users/:id" element={<User user={user} />} />
          <Route path="/blogs/:id" element={<Blog user={user} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
