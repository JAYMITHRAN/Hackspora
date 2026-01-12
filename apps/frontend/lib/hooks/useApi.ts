"use client"

import { useState, useEffect, useCallback } from "react"
import { getErrorMessage } from "@/lib/utils/error-handler"
import { performanceMonitor } from "@/lib/utils/performance"

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  immediate?: boolean
  cacheKey?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {},
): UseApiState<T> & { refetch: () => Promise<void>; reset: () => void } {
  const { immediate = true, cacheKey, onSuccess, onError } = options

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const label = cacheKey || "API Call"
      const data = await performanceMonitor.measureAsync(label, apiCall)

      setState({ data, loading: false, error: null })
      onSuccess?.(data)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      onError?.(errorMessage)
    }
  }, [cacheKey]) // Removed changing dependencies to prevent infinite loops

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return {
    ...state,
    refetch: execute,
    reset,
  }
}

// Specialized hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<{ data: T[]; total: number; hasMore: boolean }>,
  limit = 10,
) {
  const [page, setPage] = useState(1)
  const [allData, setAllData] = useState<T[]>([])
  const [hasMore, setHasMore] = useState(true)

  const { data, loading, error, refetch } = useApi(() => apiCall(page, limit), {
    immediate: true,
    onSuccess: (response) => {
      if (page === 1) {
        setAllData(response.data)
      } else {
        setAllData((prev) => [...prev, ...response.data])
      }
      setHasMore(response.hasMore)
    },
  })

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }, [loading, hasMore])

  const refresh = useCallback(() => {
    setPage(1)
    setAllData([])
    setHasMore(true)
    refetch()
  }, [refetch])

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}
