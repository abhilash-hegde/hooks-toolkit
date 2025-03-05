"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface VideoState {
  isPlaying: boolean
  duration: number
  currentTime: number
  volume: number
  muted: boolean
  isFullscreen: boolean
}

interface VideoControls {
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  seek: (time: number) => void
  toggleFullscreen: () => void
}

/**
 * Hook that provides controls for a video element
 * @param videoRef Ref to the video element
 * @returns Video state and controls
 */
export function useVideo(videoRef: React.RefObject<HTMLVideoElement>): [VideoState, VideoControls] {
  const [state, setState] = useState<VideoState>({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    muted: false,
    isFullscreen: false,
  })

  const fullscreenChangeHandler = useRef<() => void>(() => {
    setState((prevState) => ({
      ...prevState,
      isFullscreen: document.fullscreenElement !== null,
    }))
  })

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateState = () => {
      setState({
        isPlaying: !video.paused,
        duration: video.duration || 0,
        currentTime: video.currentTime || 0,
        volume: video.volume,
        muted: video.muted,
        isFullscreen: document.fullscreenElement === video,
      })
    }

    // Set up event listeners
    video.addEventListener("play", updateState)
    video.addEventListener("pause", updateState)
    video.addEventListener("timeupdate", updateState)
    video.addEventListener("volumechange", updateState)
    video.addEventListener("loadedmetadata", updateState)

    document.addEventListener("fullscreenchange", fullscreenChangeHandler.current)

    // Initial state
    updateState()

    // Clean up
    return () => {
      video.removeEventListener("play", updateState)
      video.removeEventListener("pause", updateState)
      video.removeEventListener("timeupdate", updateState)
      video.removeEventListener("volumechange", updateState)
      video.removeEventListener("loadedmetadata", updateState)

      document.removeEventListener("fullscreenchange", fullscreenChangeHandler.current)
    }
  }, [videoRef])

  const controls: VideoControls = {
    play: () => {
      if (videoRef.current) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error)
        })
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    },
    toggle: () => {
      if (videoRef.current) {
        if (state.isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play().catch((error) => {
            console.error("Error playing video:", error)
          })
        }
      }
    },
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = Math.max(0, Math.min(1, volume))
      }
    },
    mute: () => {
      if (videoRef.current) {
        videoRef.current.muted = true
      }
    },
    unmute: () => {
      if (videoRef.current) {
        videoRef.current.muted = false
      }
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, Math.min(time, state.duration))
      }
    },
    toggleFullscreen: () => {
      if (!videoRef.current) return

      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((error) => {
          console.error("Error attempting to enable fullscreen:", error)
        })
      } else {
        document.exitFullscreen()
      }
    },
  }

  return [state, controls]
}

