"use client";

import { useRef, useEffect } from "react";

/**
 * Hook that stores the previous value of a variable
 * @param value Value to track
 * @returns Previous value
 */
export function usePrevious<T>(value: T): T | undefined | null {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
