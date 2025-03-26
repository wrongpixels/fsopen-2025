import axios from "axios";
const baseUrl = "/api/blogs";

let activeToken = {};

const buildToken = (token) =>
  (activeToken = { authorization: `Bearer ${token}` });

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};
const replaceBlogData = async (data, id, showNotification) => {
  const response = await axios.put(`${baseUrl}/${id}`, data);
  if (response.data) {
    return response.data;
  } else {
    showNotification("Error updating blog info");
  }
};

const addBlog = async (blog) => {
  if (
    !activeToken ||
    !activeToken.authorization ||
    activeToken.authorization === "Bearer "
  ) {
    return { error: "Token is not valid" };
  }
  const addedBlog = await axios.post(baseUrl, blog, { headers: activeToken });
  return addedBlog.data;
};

const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`, {
      headers: activeToken,
    });
    return response.data;
  } catch (e) {
    return e.response.data;
  }
};

export default { getAll, addBlog, replaceBlogData, deleteBlog, buildToken };
