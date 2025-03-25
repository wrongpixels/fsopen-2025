import axios from "axios";
const baseUrl = "/api/blogs";

let activeToken = {};

const buildToken = (token) =>
  (activeToken = { authorization: `Bearer ${token}` });

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};
const replaceBlogData = async (blog, showNotification) => {
  const response = await axios.put(`${baseUrl}/${blog.id}`, blog);
  if (response.data) {
    return response.data;
  } else {
    showNotification("Error updating blog info");
  }
};

const addBlog = async (title, author, url) => {
  if (
    !activeToken ||
    !activeToken.authorization ||
    activeToken.authorization === "Bearer "
  ) {
    return { error: "Token is not valid" };
  }
  try {
    const addedBlog = await axios.post(
      baseUrl,
      { title, author, url },
      { headers: activeToken },
    );
    return addedBlog.data;
  } catch (e) {
    return e.response.data;
  }
};

const deleteBlog = async (id) => {
  try {
    return await axios.delete(`${baseUrl}/${id}`, {
      headers: activeToken,
    });
  } catch (e) {
    return e.response.data;
  }
};

export default { getAll, addBlog, replaceBlogData, deleteBlog, buildToken };
