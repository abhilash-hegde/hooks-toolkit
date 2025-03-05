"use client"

import { useState, useCallback, useEffect } from "react"

interface AsyncState<T> {
  status: "idle" | "pending" | "success" | "error"
  data: T | null
  error: Error | null
}

/**
 * Hook that handles async functions
 * @param asyncFunction Async function to execute
 * @param immediate Whether to execute the function immediately
 * @returns Async state and execute function
 */
export function useAsync<T, P extends any[]>(asyncFunction: (...args: P) => Promise<T>, immediate = false) {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
    data: null,
    error: null,
  })

  const execute = useCallback(
    async (...args: P) => {
      setState({
        status: "pending",
        data: null,
        error: null,
      })

      try {
        const data = await asyncFunction(...args)
        setState({
          status: "success",
          data,
          error: null,
        })
        return data
      } catch (error) {
        setState({
          status: "error",
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
        })
        throw error
      }
    },
    [asyncFunction],
  )

  useEffect(() => {
    if (immediate) {
      execute(...([] as unknown as P));
    }
  }, [execute, immediate])

  return {
    ...state,
    execute,
    isIdle: state.status === "idle",
    isPending: state.status === "pending",
    isSuccess: state.status === "success",
    isError: state.status === "error",
  }
}

