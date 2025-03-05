"use client"

import { useEffect } from "react"

/**
 * Hook that runs a callback when the component unmounts
 * @param callback Function to run on unmount
 */
export function useUnmount(callback: () => void): void {
  useEffect(() => {
    return () => {
      callback()
    }
  }, [callback])
}

