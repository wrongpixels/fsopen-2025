import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Blogs from "./components/Blogs.jsx";
import Notification from "./components/Notification";
import Users from "./components/Users";
import useActiveUser from "./hooks/useActiveUser.js";

const App = () => {
  const { activeUser: user } = useActiveUser();
  return (
    <>
      <Notification />
      {<Header user={user} />}
      <Router>
        <Routes>
          <Route path="/" element={<Blogs user={user} />} />
          <Route path="/users" element={<Users user={user} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
