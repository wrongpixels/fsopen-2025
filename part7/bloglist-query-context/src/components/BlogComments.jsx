import useInputField from "../hooks/useInputField.js";
import useNotification from "../hooks/useNotification.js";
import { useAddComment } from "../queries/blogQueries.js";

const blogSectionStyle = {
  paddingTop: 10,
  paddingLeft: 10,
  marginRight: 20,
  paddingBottom: 10,
  border: "solid",
  borderWidth: 1,
  marginTop: 10,
  marginBottom: 10,
};

const BlogComments = ({ targetBlog }) => {
  const addCommentMutation = useAddComment();
  const [comment, commentProps, commentFunctions] = useInputField("text", "Comment");
  const { showError, showNotification } = useNotification();

  const addComment = (e) => {
    e.preventDefault();

    if (!comment) {
      showError("You can't add an empty comment!");
      return;
    }
    const alreadyExists = targetBlog.comments?.find(
      (c) => c.content === comment.trim(),
    );
    if (alreadyExists) {
      showError("Same comment already exists!");
      return;
    }
    const commentData = { comment, blog: targetBlog };
    addCommentMutation.mutate(commentData, {
      onSuccess: () => {
        showNotification("Your comment was added to blog!");
        commentFunctions.clean();
      },
      onError: (error) =>
        showError(
          error.response.data?.error
            ? error.response.data.error
            : error.message,
        ),
    });
  };

  return (
    <div style={blogSectionStyle}>
      <b>Comments:</b>
      <form onSubmit={addComment}>
        <p>
          <input {...commentProps} />{" "}
          <button type="submit">Add comment</button>
        </p>
      </form>
      {targetBlog.comments && (
        <ul>
          {targetBlog.comments.map((c) => (
            <li key={c.id}>{c.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default BlogComments;
