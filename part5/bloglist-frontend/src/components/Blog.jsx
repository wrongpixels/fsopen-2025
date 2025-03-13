import Toggleable from './Toggleable.jsx'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import blogServices from '../services/blogs.js'

const Blog = ({
  blog,
  showNotification,
  likeBlog,
  activeUser,
  deleteBlog
}) => {
  const toggleRef = useRef()

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 10,
    paddingBottom: 5,
    border: 'solid',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5
  }
  const expandedBlog = {
    paddingTop: 10,
    paddingLeft: 10,
    marginRight: 20,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10
  }
  const buttonStyle =
        {
          paddingTop: 5
        }

  const handleDeleteBlog = async () => {
    if (window.confirm(`Delete blog '${blog.title}' by ${blog.author}?\n\nThis action is permanent.`)) {
      const response = await blogServices.deleteBlog(blog.id)
      if (response.error) {
        showNotification('There was an error deleting the blog')
      } else {
        deleteBlog(blog.id)
      }
    }
  }
  const deleteButton = () => {
    if (!blog.user)
    {
      return
    }
    if (blog.user.username === activeUser?.username) {
      return (
        <div style={buttonStyle}>
          <button onClick={handleDeleteBlog}>Remove</button>
        </div>
      )
    }
  }
  return (
    <div style={blogStyle} >
      <b>{blog.title}</b> {`by ${blog.author}`}<Toggleable
        ref={toggleRef}
        labelOnInvisible='Show details'
        labelOnVisible='Hide details'
        showOver={true}
        addSpace={false}
      >
        <div style={expandedBlog} >
          <b>URL:</b> <a href={blog.url}>{blog.url}</a> <br/>
          <b>Likes:</b> {blog.likes}
          <button onClick={() => likeBlog(blog)}>Like!</button>
          <br/>
          <b>Added by:</b> {blog.user?.username?blog.user.username:'?'}
          {deleteButton()}
        </div>
      </Toggleable>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired,
  activeUser: PropTypes.object.isRequired,
  deleteBlog: PropTypes.func.isRequired
}

export default Blog