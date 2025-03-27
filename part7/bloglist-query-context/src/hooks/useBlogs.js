import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateBlog,
  useDeleteBlog,
  useReplaceBlog,
  useGetBlogs,
} from "../queries/blogQueries.js";

const useBlogs = () => {
  const queryClient = useQueryClient();
  const getBlogsQuery = () => useGetBlogs();
  const createBlogMutation = useCreateBlog(queryClient);
  const deleteBlogMutation = useDeleteBlog(queryClient);
  const replaceBlogMutation = useReplaceBlog(queryClient);
  return {
    getBlogsQuery,
    createBlogMutation,
    deleteBlogMutation,
    replaceBlogMutation,
  };
};

export default useBlogs;
