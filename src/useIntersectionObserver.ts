"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Hook that tracks element visibility using IntersectionObserver
 * @param options IntersectionObserver options
 * @returns [ref, isIntersecting] tuple
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverOptions = {}
): [RefObject<T | null>, boolean] {
  const {
    root = null,
    rootMargin = "0px",
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const ref = useRef<T>(null);
  const frozen = useRef<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Don't observe if already frozen
    if (frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        // Freeze if needed
        if (freezeOnceVisible && isElementIntersecting) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, freezeOnceVisible]);

  return [ref, isIntersecting];
}
