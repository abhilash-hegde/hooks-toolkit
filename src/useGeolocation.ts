"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  loading: boolean
  accuracy: number | null
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  latitude: number | null
  longitude: number | null
  speed: number | null
  timestamp: number | null
  error: GeolocationPositionError | null
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

/**
 * Hook that provides access to the Geolocation API
 * @param options Geolocation API options
 * @returns Geolocation state
 */
export function useGeolocation(options?: GeolocationOptions): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: {
          code: 0,
          message: "Geolocation not supported",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        },
      }))
      return
    }

    const geoSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed,
        timestamp: position.timestamp,
        error: null,
      })
    }

    const geoError = (error: GeolocationPositionError) => {
      setState((s) => ({
        ...s,
        loading: false,
        error,
      }))
    }

    const watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, options)

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [options])

  return state
}

