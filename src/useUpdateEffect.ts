"use client"

import type React from "react"

import { useEffect, useRef } from "react"

/**
 * Hook that runs an effect only on updates, not on mount
 * @param effect Effect callback
 * @param deps Effect dependencies
 */
export function useUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList): void {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    return effect()
  }, [effect, ...(deps || [])])
}

