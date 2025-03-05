"use client";

import { useState, useEffect } from "react";

interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

/**
 * Hook that creates a simple animation
 * @param initialValue Initial value
 * @param targetValue Target value
 * @param options Animation options
 * @returns Current animated value
 */
export function useAnimation(
  initialValue: number,
  targetValue: number,
  options: AnimationOptions = {}
): number {
  const { duration = 1000, delay = 0, easing = (t) => t } = options;

  const [value, setValue] = useState<number>(initialValue);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;
    let timeoutId: number | null;

    const startAnimation = () => {
      const animate = (time: number) => {
        if (!startTime) startTime = time;

        const elapsedTime = time - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = easing(progress);

        setValue(initialValue + (targetValue - initialValue) * easedProgress);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    if (delay) {
      timeoutId = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [initialValue, targetValue, duration, delay, easing]);

  return value;
}
