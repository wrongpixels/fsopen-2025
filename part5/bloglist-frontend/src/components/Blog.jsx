import Toggleable from './Toggleable.jsx'
import {useRef, useState} from 'react'
import blogServices from '../services/blogs.js'
const Blog = ({ blog, showNotification }) => {
    const toggleRef = useRef()
    const [likes, setLikes] = useState(blog.likes)

    const blogStyle = {
        paddingTop:5,
        paddingLeft:10,
        paddingBottom:5,
        border: 'solid',
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 5
    }
    const expandedBlog = {
        paddingTop:10,
        paddingLeft:10,
        marginRight:20,
        paddingBottom:10,
        border: 'solid',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10
    }
    const addLike = async () => {
       const editedBlog = await blogServices.addLike({...blog, likes:blog.likes++}, showNotification)
        if (editedBlog)
        {
            setLikes(editedBlog.likes)
        }
    }
    return(
        <div style={blogStyle}>
        <b>{blog.title}</b> by {blog.author}<Toggleable
            ref={toggleRef}
            labelOnInvisible='Show details'
            labelOnVisible='Hide details'
            showOver={true}
            addSpace={false}
        >
            <div style={expandedBlog} >
                <b>URL:</b> <a href={blog.url}>{blog.url}</a> <br/>
                <b>Likes:</b> {likes} <button onClick={addLike}>Like!</button><br/>
                    <b>Added by:</b> {blog.user.username}
            </div>
        </Toggleable>
        </div>
    )
}

export default Blog