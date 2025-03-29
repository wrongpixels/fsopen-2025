import useInputField from "../hooks/useInputField.js";
import useNotification from "../hooks/useNotification.js";
import { useAddComment } from "../queries/blogQueries.js";
import styles from "./styles/componentStyles.js";
import { Button, Form } from "react-bootstrap";

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
  const [comment, commentProps, commentFunctions] = useInputField(
    "text",
    "Comment",
    "Write a comment",
  );
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
    <div>
      <div {...styles.bubble}>
        <div className="mt-2 pb-1">
          <h4>
            <b>Comments:</b>
          </h4>
        </div>
        {targetBlog.comments && (
          <ul>
            {targetBlog.comments.map((c) => (
              <li key={c.id}>
                <i>{c.content}</i>
              </li>
            ))}
          </ul>
        )}
        <Form onSubmit={addComment}>
          <Form.Group>
            <span>
              <Form.Control {...commentProps} {...styles.formField} />
              <Button type="submit" {...styles.normalButton}>
                Add comment
              </Button>
            </span>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};
export default BlogComments;
