import PropTypes from "prop-types";
import useNotification from "../hooks/useNotification.js";
import { useBlog } from "../hooks/useBlogs.js";
import { useQueryClient } from "@tanstack/react-query";
import { useMatch, useNavigate } from "react-router-dom";

const Blog = ({ user }) => {
  const { showError, showNotification } = useNotification();
  const { blogsQuery, deleteBlogMutation, replaceBlogMutation } = useBlog();
  const { isLoading, isError, data } = blogsQuery;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cachedBlogs = queryClient.getQueryData(["blogs"]);

  const match = useMatch("/blogs/:id");
  const blogs = cachedBlogs ? cachedBlogs : isError || isLoading ? null : data;
  if (!user) {
    return null;
  }
  if (!blogs) {
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return <h3>Error loading blogs data.</h3>;
    }
  }
  if (!blogs) {
    return <div>No blogs data available.</div>;
  }

  const targetBlog = blogs.find((b) => b.id === match?.params.id);
  if (!targetBlog) {
    return <div>Blog data not found in server.</div>;
  }

  const deleteBlog = () => {
    deleteBlogMutation.mutate(targetBlog, {
      onSuccess: () =>
        showNotification(`Blog '${targetBlog.title}' was deleted!`),
      onError: () => showError("There was an error deleting the blog"),
    });
  };

  const addLike = () => {
    replaceBlogMutation.mutate(
      { id: targetBlog.id, likes: targetBlog.likes + 1 },
      {
        onSuccess: () =>
          showNotification(`Blog '${targetBlog.title}' was liked!`),
        onError: () => showError("There was an error adding the like"),
      },
    );
  };

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 10,
    paddingBottom: 5,
    border: "solid",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
  };
  const expandedBlog = {
    paddingTop: 10,
    paddingLeft: 10,
    marginRight: 20,
    paddingBottom: 10,
    border: "solid",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  };
  const buttonStyle = {
    paddingTop: 5,
  };

  const handleDeleteBlog = async () => {
    if (
      window.confirm(
        `Delete blog '${targetBlog.title}' by ${targetBlog.author}?\n\nThis action is permanent.`,
      )
    ) {
      deleteBlog();
    }
  };
  const deleteButton = () => {
    if (!targetBlog.user) {
      return;
    }
    if (targetBlog.user.username === user?.username) {
      return (
        <div style={buttonStyle}>
          <button onClick={handleDeleteBlog}>Remove</button>
        </div>
      );
    }
  };
  return (
    <div style={blogStyle} className="blog-entry">
      <b>{targetBlog.title}</b> {`by ${targetBlog.author}`}
      <div style={expandedBlog}>
        <b>URL:</b> <a href={targetBlog.url}>{targetBlog.url}</a> <br />
        <b>Likes:</b> <span className="blog-likes">{targetBlog.likes}</span>
        <button onClick={addLike}>Like!</button>
        <br />
        <b>Added by:</b>{" "}
        {targetBlog.user?.username ? targetBlog.user.username : "?"}
        {deleteButton()}
      </div>
      <button onClick={() => navigate("/")}>Go back</button>
    </div>
  );
};

Blog.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Blog;
