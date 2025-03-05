"use client"

import { useState, useEffect } from "react"

/**
 * Hook that detects when a key is pressed
 * @param targetKey Key to detect
 * @returns Boolean indicating if the key is pressed
 */
export function useKeyPress(targetKey: string): boolean {
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsKeyPressed(true)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setIsKeyPressed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [targetKey])

  return isKeyPressed
}

