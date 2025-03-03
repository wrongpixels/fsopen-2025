import Toggleable from './Toggleable.jsx'
import {useRef} from 'react'
const Blog = ({ blog }) => {
    const toggleRef = useRef()
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
                <b>URL:</b> {blog.url}<br/>
                <b>Likes:</b> {blog.likes} <button>Like!</button><br/>
                    <b>Added by:</b> {blog.user.username}
            </div>
        </Toggleable>
        </div>
    )
}

export default Blog