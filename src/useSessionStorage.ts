"use client"

import type React from "react"

import { useState, useEffect } from "react"

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>

/**
 * Hook that manages state in sessionStorage
 * @param key sessionStorage key
 * @param initialValue Initial value or function that returns the initial value
 * @returns [storedValue, setValue] tuple
 */
export function useSessionStorage<T>(key: string, initialValue: T | (() => T)): [T, SetValue<T>] {
  // Get from session storage then parse stored json or return initialValue
  const readValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue instanceof Function ? initialValue() : initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue instanceof Function ? initialValue() : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(readValue())

  // Return a wrapped version of useState's setter function that persists the new value to sessionStorage
  const setValue: SetValue<T> = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value

      // Save state
      setStoredValue(valueToStore)

      // Save to session storage
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    const item = window.sessionStorage.getItem(key)
    if (item) {
      setStoredValue(JSON.parse(item))
    }
  }, [key]) // Added key to dependencies

  return [storedValue, setValue]
}

