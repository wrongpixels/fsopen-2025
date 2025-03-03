import axios from 'axios'
const baseUrl = '/api/blogs'

let activeToken = {}

const buildToken = (token) => activeToken = {authorization: `Bearer ${token}`}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const addBlog = async (title, author, url) => {
  if (!activeToken || !activeToken.authorization || activeToken.authorization === 'Bearer ')
  {
    return {error: 'Token is not valid'}
  }
  try {
    const addedBlog = (await axios.post(baseUrl, {title, author, url}, {headers: activeToken}))
    return addedBlog.data
  }catch (e){
    return e.response.data
  }
}

export default { getAll, addBlog, buildToken }