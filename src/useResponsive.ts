"use client"

import { useMediaQuery } from "./useMediaQuery"

interface Breakpoints {
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

interface ResponsiveState {
  /** Whether the screen is smaller than the sm breakpoint */
  isMobile: boolean
  /** Whether the screen is between sm and md breakpoints */
  isTablet: boolean
  /** Whether the screen is between md and lg breakpoints */
  isDesktop: boolean
  /** Whether the screen is larger than the lg breakpoint */
  isLargeDesktop: boolean
  /** Current breakpoint name */
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
  /** Whether the screen is smaller than the specified breakpoint */
  down: (breakpoint: keyof Breakpoints) => boolean
  /** Whether the screen is larger than the specified breakpoint */
  up: (breakpoint: keyof Breakpoints) => boolean
  /** Whether the screen is between the specified breakpoints */
  between: (start: keyof Breakpoints, end: keyof Breakpoints) => boolean
}

/**
 * Hook for responsive design
 * 
 * @param customBreakpoints Optional custom breakpoints
 * @returns Object containing responsive state and utility functions
 * 
 * @example
 * ```tsx
 * const { isMobile, isTablet, breakpoint, up, down, between } = useResponsive();
 * 
 * return (
 *   <div>
 *     <p>Current breakpoint: {breakpoint}</p>
 *     {isMobile && <MobileMenu />}
 *     {isTablet && <TabletLayout />}
 *     {up('lg') && <DesktopFeature />}
 *     {between('sm', 'lg') && <TabletAndSmallDesktopFeature />}
 *   </div>
 * );
 * ```
 */
export function useResponsive(customBreakpoints?: Partial<Breakpoints>): ResponsiveState {
  const defaultBreakpoints: Breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  }
  
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints }
  
  const sm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`)
  const md = useMediaQuery(`(min-width: ${breakpoints.md}px)`)
  const lg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`)
  const xl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`)
  const xxl = useMediaQuery(`(min-width: ${breakpoints.xxl}px)`)
  
  // Determine current breakpoint
  let breakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "xxl" = "xs"
  if (xxl) breakpoint = "xxl"
  else if (xl) breakpoint = "xl"
  else if (lg) breakpoint = "lg"
  else if (md) breakpoint = "md"
  else if (sm) breakpoint = "sm"
  
  // Helper functions
  const down = (bp: keyof Breakpoints) => {
    const breakpointValues = {
      sm: sm,
      md: md,
      lg: lg,
      xl: xl,
      xxl: xxl,
    }
    return !breakpointValues[bp]
  }
  
  const up = (bp: keyof Breakpoints) => {
    const breakpointValues = {
      sm: sm,
      md: md,
      lg: lg,
      xl: xl,
      xxl: xxl,
    }
    return breakpointValues[bp]
  }
  
  const between = (start: keyof Breakpoints, end: keyof Breakpoints) => {
    return up(start) && down(end)
  }
  
  return {
    isMobile: !sm,
    isTablet: sm && !md,
    isDesktop: md && !xl,
    isLargeDesktop: xl,
    breakpoint,
    down,
    up,
    between,
  }
}
