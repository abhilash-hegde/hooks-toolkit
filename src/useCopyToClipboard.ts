"use client"

import { useState, useCallback } from "react"

interface CopyToClipboardState {
  value: string
  success: boolean
  error: Error | null
}

type CopyFn = (text: string) => Promise<boolean>

/**
 * Hook that provides clipboard copy functionality
 * @returns [state, copy] tuple
 */
export function useCopyToClipboard(): [CopyToClipboardState, CopyFn] {
  const [state, setState] = useState<CopyToClipboardState>({
    value: "",
    success: false,
    error: null,
  })

  const copy: CopyFn = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)

      setState({
        value: text,
        success: true,
        error: null,
      })

      return true
    } catch (error) {
      setState({
        value: "",
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      })

      return false
    }
  }, [])

  return [state, copy]
}

