"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useMediaQuery } from "./useMediaQuery";

type Theme = "dark" | "light" | "system";

interface UseDarkModeReturn {
  /** Current theme (dark or light) */
  isDarkMode: boolean;
  /** Current theme setting (dark, light, or system) */
  theme: Theme;
  /** Function to set the theme */
  setTheme: (theme: Theme) => void;
  /** Function to toggle between dark and light mode */
  toggle: () => void;
  /** Function to enable dark mode */
  enable: () => void;
  /** Function to disable dark mode */
  disable: () => void;
}

/**
 * Hook for managing dark mode
 *
 * @returns Object containing dark mode state and control functions
 *
 * @example
 * ```tsx
 * const { isDarkMode, toggle, theme, setTheme } = useDarkMode();
 *
 * return (
 *   <div>
 *     <button onClick={toggle}>
 *       Toggle {isDarkMode ? "Light" : "Dark"} Mode
 *     </button>
 *     <select
 *       value={theme}
 *       onChange={(e) => setTheme(e.target.value as Theme)}
 *     >
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   </div>
 * );
 * ```
 */
export function useDarkMode(): UseDarkModeReturn {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, setTheme] = useLocalStorage<Theme>("theme", "system");

  const isDarkMode = theme === "system" ? prefersDarkMode : theme === "dark";

  const toggle = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const enable = () => setTheme("dark");
  const disable = () => setTheme("light");

  useEffect(() => {
    const root = window.document.documentElement;

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return {
    isDarkMode,
    theme,
    setTheme,
    toggle,
    enable,
    disable,
  };
}
