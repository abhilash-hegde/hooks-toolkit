"use client"

import { useState, useEffect } from "react"

interface ImageState {
  isLoading: boolean
  isLoaded: boolean
  error: Error | null
}

/**
 * Hook that tracks image loading state
 * @param src Image source URL
 * @returns Image loading state
 */
export function useImageLoad(src?: string): ImageState {
  const [state, setState] = useState<ImageState>({
    isLoading: !!src,
    isLoaded: false,
    error: null,
  })

  useEffect(() => {
    if (!src) {
      setState({
        isLoading: false,
        isLoaded: false,
        error: null,
      })
      return
    }

    setState({
      isLoading: true,
      isLoaded: false,
      error: null,
    })

    const image = new Image()

    const onLoad = () => {
      setState({
        isLoading: false,
        isLoaded: true,
        error: null,
      })
    }

    const onError = (error: ErrorEvent) => {
      setState({
        isLoading: false,
        isLoaded: false,
        error: new Error(`Failed to load image: ${error.message}`),
      })
    }

    image.addEventListener("load", onLoad)
    image.addEventListener("error", onError)

    image.src = src

    return () => {
      image.removeEventListener("load", onLoad)
      image.removeEventListener("error", onError)
    }
  }, [src])

  return state
}

