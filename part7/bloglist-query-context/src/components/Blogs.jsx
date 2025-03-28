import { useRef } from "react";
import { Link } from "react-router-dom";
import {Table} from "react-bootstrap"
import Toggleable from "../components/Toggleable";
import NewBlog from "../components/NewBlog";
import useNotification from "../hooks/useNotification.js";
import { useBlogs } from "../hooks/useBlogs.js";

const Blogs = ({ user }) => {
  const { showError, showNotification } = useNotification();
  const { blogsQuery, createBlogMutation } = useBlogs();
  const { isLoading, isError, data } = blogsQuery;

  const newBlogRef = useRef();
  if (!user) {
    return null;
  }
  if (isLoading) {
    return <h2>Loading app…</h2>;
  }
  if (isError) {
    return (
      <h3>
        Server not available! <p>Please, try later.</p>
      </h3>
    );
  }

  const blogs = data;
  const addNewBlog = async (blog) => {
    try {
      const newBlog = await createBlogMutation.mutateAsync(blog);
      showNotification(
        `'${newBlog.title}' by ${newBlog.author} was added to the Blog List!`,
      );
      newBlogRef.current?.toggleVisibility();
      return newBlog;
    } catch (e) {
      if (e.response?.data?.error) {
        showError(e.response.data.error);
      } else {
        showError("There was an error adding the entry");
      }
    }
  };

  return (
    <>
      <h2>Blogs</h2>
      <div className="blog-list">
        <Table striped>
          <thead>
          <tr>
            <th>Title:</th>
            <th>Blog author:</th>
          </tr>
          </thead>
          <tbody>
          {blogs.map((b) => (
          <tr key={b.id} >

            <td><b>{<Link to={`/blogs/${b.id}`}>{b.title}</Link>} </b> </td>
              <td> {`${b.author}`}</td>
          </tr>
        ))}
          </tbody>
        </Table>
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
              addNewBlog={addNewBlog}
            />
          </Toggleable>
        </div>
      </div>
    </>
  );
};

export default Blogs;
