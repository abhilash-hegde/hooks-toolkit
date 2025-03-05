"use client"

import { useEffect, useRef } from "react"

/**
 * Hook that memoizes a value and only updates when the comparison function returns false
 * @param value Value to memoize
 * @param compare Function that compares previous and current values
 * @returns Memoized value
 */
export function useMemoCompare<T>(value: T, compare: (prev: T | undefined, next: T) => boolean): T {
  const previousRef = useRef<T | undefined>(undefined)
  const previous = previousRef.current

  const isEqual = previous !== undefined && compare(previous, value)

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = value
    }
  })

  return isEqual ? (previous as T) : value
}

