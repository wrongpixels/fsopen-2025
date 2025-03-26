import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs.js";

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: orderedBlogs,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

const orderedBlogs = async () => {
  const targetBlogs = await blogService.getAll();
  return [...targetBlogs].sort((a, b) => b.likes - a.likes);
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: "blogs",
    mutationFn: blogService.addBlog,
    onSuccess: (newBlog) =>
      queryClient.setQueryData(
        ["blogs"],
        queryClient.getQueryData(["blogs"]).concat(newBlog),
      ),
  });
};
