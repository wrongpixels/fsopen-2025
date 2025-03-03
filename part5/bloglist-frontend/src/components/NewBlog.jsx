import {useState, useEffect} from 'react'
import blogServices from '../services/blogs.js'

const NewBlog = ({showNotification, getAllBlogs}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = async (event) =>
    {
        event.preventDefault()
        if (!title || !author || !url)
        {
            showNotification('Can\'t add an entry with empty fields!')
            return
        }
       const newBlog = await blogServices.addBlog(title, author, url)
        if (newBlog && newBlog.title === title)
        {
            showNotification(`${title} was added to the Blog List!`)
            getAllBlogs()
            setTitle('')
            setAuthor('')
            setUrl('')
        }
        else
        {
            showNotification(newBlog.error)
        }
    }

    return (
        <>
            <h3>Add a new Blog</h3>
            <form onSubmit={addBlog}>
                <div>
                Title:
                <input
                    type="text"
                    onChange={({target}) => setTitle(target.value)}
                    value={title}
                    name="Title"
                />
                </div>
                <div>
                    Author:
                    <input
                        type="text"
                        value={author}
                        onChange={({target}) => setAuthor(target.value)}
                        name="Author"
                    />
                </div>
                <div>
                    Url:
                    <input
                        type="url"
                        value={url}
                        onChange={({target}) => setUrl(target.value)}
                        name="Url"
                    />
                </div>
                <div>
                    <button type="submit">Add entry</button>
                </div>
            </form>
        </>
    )

}
export default NewBlog