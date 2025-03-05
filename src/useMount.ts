"use client"

import { useEffect } from "react"

/**
 * Hook that runs a callback when the component mounts
 * @param callback Function to run on mount
 */
export function useMount(callback: () => void): void {
  useEffect(() => {
    callback()
  }, [callback])
}

