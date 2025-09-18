import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Task } from '../types'
import { useError } from './useError'
import { useEffect } from 'react'

export const useQueryTasks = () => {
  const { switchErrorHandling } = useError()
  const getTasks = async () => {
    const { data } = await axios.get<Task[]>(
      `${process.env.REACT_APP_API_URL}/tasks`,
      { withCredentials: true }
    )
    return data
  }
  const query = useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: getTasks,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (query.error) {
      const err = query.error as any
      if (err.response?.data?.message) {
        switchErrorHandling(err.response.data.message)
      } else if (err.response?.data) {
        switchErrorHandling(err.response.data)
      }
    }
  }, [query.error, switchErrorHandling])

  return query
}
