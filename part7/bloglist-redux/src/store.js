import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer.js";
import blogsReducer from "./reducers/blogsReducer.js";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
  },
});

export default store;
