"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"

interface UseStateWithHistoryReturn<T> {
  state: T
  setState: React.Dispatch<React.SetStateAction<T>>
  history: T[]
  pointer: number
  back: () => void
  forward: () => void
  go: (index: number) => void
}

/**
 * Hook that manages state with history tracking
 * @param initialState Initial state
 * @param capacity Maximum history capacity (default: 100)
 * @returns State with history controls
 */
export function useStateWithHistory<T>(initialState: T, capacity = 100): UseStateWithHistoryReturn<T> {
  const [state, setState] = useState<T>(initialState)
  const historyRef = useRef<T[]>([initialState])
  const pointerRef = useRef<number>(0)

  const set = useCallback(
    (value: React.SetStateAction<T>) => {
      const resolvedValue = typeof value === "function" ? (value as (prevState: T) => T)(state) : value

      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        // If we're not at the end of the history, remove future states
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current = historyRef.current.slice(0, pointerRef.current + 1)
        }

        // Add new state to history
        historyRef.current.push(resolvedValue)

        // If we've exceeded capacity, remove oldest state
        if (historyRef.current.length > capacity) {
          historyRef.current.shift()
        }

        // Update pointer to the end
        pointerRef.current = historyRef.current.length - 1
      }

      setState(resolvedValue)
    },
    [state, capacity],
  )

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return

    pointerRef.current--
    setState(historyRef.current[pointerRef.current])
  }, [])

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return

    pointerRef.current++
    setState(historyRef.current[pointerRef.current])
  }, [])

  const go = useCallback((index: number) => {
    if (index < 0 || index >= historyRef.current.length) return

    pointerRef.current = index
    setState(historyRef.current[index])
  }, [])

  return {
    state,
    setState: set,
    history: historyRef.current,
    pointer: pointerRef.current,
    back,
    forward,
    go,
  }
}

