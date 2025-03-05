"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface ContextMenuState {
  visible: boolean
  x: number
  y: number
}

/**
 * Hook that manages a context menu
 * @param ref Ref to the element that should trigger the context menu
 * @returns Context menu state and show/hide functions
 */
export function useContextMenu<T extends HTMLElement = HTMLElement>(ref: React.RefObject<T>) {
  const [state, setState] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  })

  const show = useCallback((event: MouseEvent) => {
    event.preventDefault()

    setState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  const hide = useCallback(() => {
    setState((prev) => ({
      ...prev,
      visible: false,
    }))
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener("contextmenu", show)
    document.addEventListener("click", hide)
    document.addEventListener("scroll", hide)

    return () => {
      element.removeEventListener("contextmenu", show)
      document.removeEventListener("click", hide)
      document.removeEventListener("scroll", hide)
    }
  }, [ref, show, hide])

  return {
    ...state,
    show,
    hide,
  }
}

