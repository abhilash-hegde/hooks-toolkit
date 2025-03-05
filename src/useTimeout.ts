"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook that sets up a timeout
 * @param callback Function to call after the timeout
 * @param delay Delay in milliseconds (null to pause)
 * @returns Object with reset and clear functions
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();

    if (delay !== null) {
      timeoutRef.current = setTimeout(() => {
        savedCallback.current();
      }, delay);
    }
  }, [delay, clear]);

  useEffect(() => {
    reset();
    return clear;
  }, [reset, clear]); // Removed unnecessary dependency: delay

  return { reset, clear };
}
