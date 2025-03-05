"use client"

import { useEffect, useRef, useCallback } from "react"

/**
 * Hook that tracks if a component is mounted
 * @returns Function that returns true if the component is mounted
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return useCallback(() => isMounted.current, [])
}

