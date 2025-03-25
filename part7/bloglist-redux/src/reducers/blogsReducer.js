import blogService from "../services/blogs.js";
import { createSlice } from "@reduxjs/toolkit";
import { createAlert } from "../reducers/notificationReducer.js";

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setAll: (state, { payload }) => {
      return orderBlogs(payload);
    },
    create: (state, { payload }) => {
      state.push(payload);
    },
    edit: (state, { payload }) =>
      orderBlogs(state.map((b) => (b.id === payload.id ? payload : b))),
  },
});

const orderBlogs = (targetBlogs) =>
  [...targetBlogs].sort((a, b) => b.likes - a.likes);

export const { setAll, create, edit } = blogsSlice.actions;

const isValid = (data) => data && !data.error;

export const getAllBlogs = () => {
  return async (dispatch) => {
    const data = await blogService.getAll();
    if (isValid(data)) {
      dispatch(setAll(data));
    }
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const data = await blogService.addBlog(blog.title, blog.author, blog.url);
    if (isValid(data)) {
      dispatch(create(data));
      dispatch(
        createAlert(
          `'${data.title}' by ${data.author} was added to the Blog List!`,
          false,
        ),
      );
    } else if (data.error) {
      dispatch(createAlert(data.error));
    } else {
      dispatch(createAlert("There was an error adding the entry"));
    }
  };
};

export const replaceBlog = (blog) => {
  return async (dispatch) => {
    const { data } = await blogService.replaceBlogData(blog);
    if (isValid(data)) {
      dispatch(edit(data));
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    dispatch(replaceBlog(newBlog));
  };
};

export default blogsSlice.reducer;
