import axios from 'axios'
const baseUrl = '/api/blogs'

let activeToken = {}

const buildToken = (token) => activeToken = { authorization: `Bearer ${token}` }

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const buildBlogData = (blog) => {
  return { ...blog, likes:blog.likes+1, user:blog.user.id }
}

const addLike = async (blog, showNotification) => {
  const modifiedBlog = { likes:blog.likes+1 }

  const response = await axios.put(`${baseUrl}/${blog.id}`, modifiedBlog)

  if (response.data)
  {
    showNotification('Liked the blog!', false)
    return response.data
  }
  else
  {
    showNotification('Error updating blog info')
  }
}

const addBlog = async (title, author, url) => {
  if (!activeToken || !activeToken.authorization || activeToken.authorization === 'Bearer ')
  {
    return { error: 'Token is not valid' }
  }
  try {
    const addedBlog = (await axios.post(baseUrl, { title, author, url }, { headers: activeToken }))
    return addedBlog.data
  }catch (e){
    return e.response.data
  }
}

const deleteBlog = async (id) => {
  try
  {
    const response = await axios.delete(`${baseUrl}/${id}`, { headers: activeToken })
    return response.data
  }catch (e){
    return e.response.data
  }
}

export default { getAll, addBlog, addLike, deleteBlog, buildToken }