"use client"

import { useState, useEffect, useRef } from "react"

interface AudioState {
  isPlaying: boolean
  duration: number
  currentTime: number
  volume: number
  muted: boolean
}

interface AudioControls {
  play: () => void
  pause: () => void
  toggle: () => void
  setVolume: (volume: number) => void
  mute: () => void
  unmute: () => void
  seek: (time: number) => void
}

/**
 * Hook that provides controls for an audio element
 * @param src Audio source URL
 * @returns Audio state and controls
 */
export function useAudio(src?: string): [AudioState, AudioControls] {
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    volume: 1,
    muted: false,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio

    const updateState = () => {
      setState({
        isPlaying: !audio.paused,
        duration: audio.duration || 0,
        currentTime: audio.currentTime || 0,
        volume: audio.volume,
        muted: audio.muted,
      })
    }

    // Set up event listeners
    audio.addEventListener("play", updateState)
    audio.addEventListener("pause", updateState)
    audio.addEventListener("timeupdate", updateState)
    audio.addEventListener("volumechange", updateState)
    audio.addEventListener("loadedmetadata", updateState)

    // Clean up
    return () => {
      audio.pause()
      audio.removeEventListener("play", updateState)
      audio.removeEventListener("pause", updateState)
      audio.removeEventListener("timeupdate", updateState)
      audio.removeEventListener("volumechange", updateState)
      audio.removeEventListener("loadedmetadata", updateState)
    }
  }, [src])

  const controls: AudioControls = {
    play: () => {
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
    },
    pause: () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    },
    toggle: () => {
      if (audioRef.current) {
        if (state.isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play().catch((error) => {
            console.error("Error playing audio:", error)
          })
        }
      }
    },
    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, volume))
      }
    },
    mute: () => {
      if (audioRef.current) {
        audioRef.current.muted = true
      }
    },
    unmute: () => {
      if (audioRef.current) {
        audioRef.current.muted = false
      }
    },
    seek: (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = Math.max(0, Math.min(time, state.duration))
      }
    },
  }

  return [state, controls]
}

