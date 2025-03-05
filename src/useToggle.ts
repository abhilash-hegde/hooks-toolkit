"use client"

import { useState, useCallback } from "react"

/**
 * Hook that manages a boolean toggle state
 * @param initialState Initial boolean state
 * @returns [state, toggle] tuple
 */
export function useToggle(initialState = false): [boolean, (nextValue?: any) => void] {
  const [state, setState] = useState<boolean>(initialState)

  const toggle = useCallback((nextValue?: any) => {
    if (typeof nextValue === "boolean") {
      setState(nextValue)
    } else {
      setState((state) => !state)
    }
  }, [])

  return [state, toggle]
}

