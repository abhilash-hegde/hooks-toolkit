"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ScrollPosition {
  x: number
  y: number
}

/**
 * Hook that tracks scroll position
 * @param element Element to track (defaults to window)
 * @returns Current scroll position
 */
export function useScrollPosition(element?: React.RefObject<HTMLElement>): ScrollPosition {
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 })

  useEffect(() => {
    const target = element?.current ?? window

    const handleScroll = () => {
      if (target === window) {
        setPosition({
          x: window.scrollX,
          y: window.scrollY,
        })
      } else {
        setPosition({
          x: (target as HTMLElement).scrollLeft,
          y: (target as HTMLElement).scrollTop,
        })
      }
    }

    // Set initial position
    handleScroll()

    target.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      target.removeEventListener("scroll", handleScroll)
    }
  }, [element])

  return position
}

