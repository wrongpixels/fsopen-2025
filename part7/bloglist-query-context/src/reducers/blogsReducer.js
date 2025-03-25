import blogService from "../services/blogs.js";
import { createSlice } from "@reduxjs/toolkit";
import { createAlert } from "./notificationReducer.js";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: null,
  reducers: {
    setAll: (state, { payload }) => {
      return orderBlogs(payload ? payload : []);
    },
    create: (state, { payload }) => {
      state.push(payload);
    },
    edit: (state, { payload }) =>
      orderBlogs(state.map((b) => (b.id === payload.id ? payload : b))),
    remove: (state, { payload }) => state.filter((b) => b.id !== payload),
  },
});

const orderBlogs = (targetBlogs) =>
  [...targetBlogs].sort((a, b) => b.likes - a.likes);

export const { setAll, create, edit, remove } = blogsSlice.actions;

const isValid = (data) => data && !data.error;
const getBlogInfo = (data) => `'${data.title}' by ${data.author}`;

export const getAllBlogs = () => {
  return async (dispatch) => {
    try {
      const data = await blogService.getAll();
      if (isValid(data)) {
        dispatch(setAll(data));
      }
    } catch {
      dispatch(createAlert("There was an error accessing the server"));
    }
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const data = await blogService.addBlog(blog.title, blog.author, blog.url);
    if (isValid(data)) {
      dispatch(create(data));
      dispatch(
        createAlert(`${getBlogInfo(data)} was added to the Blog List!`, false),
      );
      return data;
    } else if (data.error) {
      dispatch(createAlert(data.error));
    } else {
      dispatch(createAlert("There was an error adding the entry"));
    }
  };
};

export const replaceBlog = (modifiedData, id) => {
  return async (dispatch) => {
    const data = await blogService.replaceBlogData({ ...modifiedData, id });
    if (isValid(data)) {
      dispatch(edit(data));
    }
  };
};
export const likeBlog = (blog) => {
  return async (dispatch) => {
    const blogData = { likes: blog.likes + 1 };
    try {
      dispatch(replaceBlog(blogData, blog.id));
      dispatch(createAlert(`'${blog.title}' was liked!`, false));
    } catch (e) {
      dispatch(createAlert(`There was an error liking ${blog.title}`));
    }
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.deleteBlog(blog.id);
      dispatch(remove(blog.id));
      dispatch(
        createAlert(`${getBlogInfo(blog)} was removed from the list`, false),
      );
    } catch (e) {
      dispatch(createAlert(`There was an error removing the blog`));
    }
  };
};

export default blogsSlice.reducer;
