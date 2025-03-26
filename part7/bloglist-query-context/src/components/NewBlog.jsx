import { useState } from "react";

const NewBlog = ({ showNotification, addNewBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleAddBlog = async (event) => {
    event.preventDefault();
    if (!title || !author || !url) {
      showNotification("Can't add an entry with empty fields!");
      return;
    }
    const newBlog = await addNewBlog({ title, author, url });
    if (newBlog && newBlog.title === title) {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };

  return (
    <>
      <h3>Add a new Blog</h3>
      <form onSubmit={handleAddBlog}>
        <div>
          Title:
          <input
            type="text"
            onChange={({ target }) => setTitle(target.value)}
            value={title}
            name="Title"
            placeholder="Blog title"
            data-testid="blog-title"
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            name="Author"
            placeholder="Blog author"
            data-testid="blog-author"
          />
        </div>
        <div>
          Url:
          <input
            type="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            name="Url"
            placeholder="Blog URL"
            data-testid="blog-url"
          />
        </div>
        <p>
          <button type="submit">Add entry</button>
        </p>
      </form>
    </>
  );
};
export default NewBlog;
