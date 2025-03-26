import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs.js'

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

const getBlogs = async () => {
  const targetBlogs = await blogService.getAll()
  return orderBlogs(targetBlogs)
}

const orderBlogs = (targetBlogs) =>
  [...targetBlogs].sort((a, b) => b.likes - a.likes)

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: 'blogs',
    mutationFn: blogService.addBlog,
    onSuccess: (newBlog) =>
      queryClient.setQueryData(
        ['blogs'],
        queryClient.getQueryData(['blogs']).concat(newBlog),
      ),
  })
}

export const useReplaceBlog = () => {
  const client = useQueryClient()
  return useMutation({
    mutationKey: 'blogs',
    mutationFn: blogService.replaceBlogData,
    onSuccess: (edited) =>
      client.setQueryData(
        ['blogs'],
        orderBlogs(
          client
            .getQueryData(['blogs'])
            .map((b) => (b.id === edited.id ? edited : b)),
        ),
      ),
  })
}

export const useDeleteBlog = () => {
  const client = useQueryClient()
  return useMutation({
    mutationKey: 'blogs',
    mutationFn: blogService.deleteBlog,
    onSuccess: (id) =>
      client.setQueryData(
        ['blogs'],
        client.getQueryData(['blogs']).filter((b) => b.id !== id),
      ),
  })
}
