"use client"

import { useState, useCallback } from "react"

interface ClipboardState {
  copied: boolean
  text: string
  error: Error | null
}

/**
 * Hook that provides clipboard functionality
 * @returns Clipboard state and copy function
 */
export function useClipboard(): [ClipboardState, (text: string) => Promise<void>] {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    text: "",
    error: null,
  })

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)

      setState({
        copied: true,
        text,
        error: null,
      })

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          copied: false,
        }))
      }, 2000)
    } catch (error) {
      setState({
        copied: false,
        text: "",
        error: error instanceof Error ? error : new Error(String(error)),
      })
    }
  }, [])

  return [state, copy]
}

