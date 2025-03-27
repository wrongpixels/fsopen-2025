import { useRef } from "react";
import Toggleable from "../components/Toggleable";
import Blog from "../components/Blog";
import NewBlog from "../components/NewBlog";
import useNotification from "../hooks/useNotification.js";
import useBlogs from "../hooks/useBlogs.js";

const Blogs = ({ user }) => {
  const { showError, showNotification } = useNotification();
  const {
    getBlogsQuery,
    createBlogMutation,
    replaceBlogMutation,
    deleteBlogMutation,
  } = useBlogs();
  const newBlogRef = useRef();
  const { isLoading, isError, data } = getBlogsQuery();
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
  const deleteBlog = (blog) => {
    deleteBlogMutation.mutate(blog, {
      onSuccess: () => showNotification(`Blog '${blog.title}' was deleted!`),
      onError: () => showError("There was an error deleting the blog"),
    });
  };

  const addLike = (blog) => {
    replaceBlogMutation.mutate(
      { id: blog.id, likes: blog.likes + 1 },
      {
        onSuccess: () => showNotification(`Blog '${blog.title}' was liked!`),
        onError: () => showError("There was an error adding the like"),
      },
    );
  };
  return (
    <>
      <div className="blog-list">
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            showNotification={showNotification}
            blog={blog}
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
              showNotification={showNotification}
              addNewBlog={addNewBlog}
            />
          </Toggleable>
        </div>
      </div>
    </>
  );
};

export default Blogs;
