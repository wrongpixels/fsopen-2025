import useInputField from "../hooks/useInputField.js"
import useNotification from "../hooks/useNotification.js"

const NewBlog = ({ addNewBlog }) => {
  const {showNotification} = useNotification()
  const [title, titleProps, titleFns] = useInputField("text", "Title", "Blog title", "blog-title")
  const [author, authorProps, authorFns] = useInputField("text", "Author", "Blog author", "blog-author")
  const [url, urlProps, urlFns] = useInputField("text", "Url", "Blog URL", "blog-url")

  const handleAddBlog = async (event) => {
    event.preventDefault()
    if (!title || !author || !url) {
      showNotification('Can\'t add an entry with empty fields!')
      return
    }
    const newBlog = await addNewBlog({ title, author, url })
    if (newBlog && newBlog.title === title) {
      titleFns.clean()
      authorFns.clean()
      urlFns.clean()
    }
  }

  return (
    <>
      <h3>Add a new Blog</h3>
      <form onSubmit={handleAddBlog}>
        <div>
          <input
              {...titleProps}
          />
        </div>
        <div>
          <input
              {...authorProps}
          />
        </div>
        <div>
          <input
              {...urlProps}
          />
        </div>
        <p>
          <button type="submit">Add entry</button>
        </p>
      </form>
    </>
  )
}
export default NewBlog
