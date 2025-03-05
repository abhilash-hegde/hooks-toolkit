"use client"

import { useRef, useEffect } from "react"

/**
 * Hook that counts component renders
 * @returns Number of renders
 */
export function useRenderCount(): number {
  const count = useRef(0)

  useEffect(() => {
    count.current += 1
  })

  return count.current
}

